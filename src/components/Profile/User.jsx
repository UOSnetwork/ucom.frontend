import PropTypes from 'prop-types';
import { pick, cloneDeep } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import profileStyles from './styles.css';
import gridStyles from '../Grid/styles.css'; // TODO: Move to ./styles.css
import DropzoneWrapper from '../DropzoneWrapper';
import IconUser from '../Icons/User';
import IconCover from '../Icons/Cover';
import TextInput from '../TextInput';
import Textarea from '../TextareaAutosize';
import Button from '../Button/index';
import IconRemove from '../Icons/Remove';
import UserPick from '../UserPick/UserPick';
import urls from '../../utils/urls';
import Validate from '../../utils/validate';
import { updateUser } from '../../actions/users';
import { addValidationErrorNotification, addSuccessNotification } from '../../actions/notifications';
import withLoader from '../../utils/withLoader';
import * as selectors from '../../store/selectors';
import Menu from './Menu';

const USER_EDITABLE_PROPS = [
  'avatarFilename',
  'firstName',
  'about',
  'usersSources',
  'personalWebsiteUrl',
];

const Profile = ({ onSuccess }) => {
  const user = useSelector(selectors.selectOwner);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(undefined);
  const dispatch = useDispatch();

  const validate = (data) => {
    const { errors, isValid } = Validate.validateUser(data);

    setErrors(errors);

    return isValid;
  };

  const setDataAndValidate = (data) => {
    setData(data);
    validate(data);
  };

  const submit = async (data) => {
    const isValid = validate(data);

    setSubmited(true);

    if (!isValid) {
      dispatch(addValidationErrorNotification());
    }

    if (!isValid || loading) {
      return;
    }

    setLoading(true);

    try {
      await withLoader(dispatch(updateUser(data)));
      dispatch(addSuccessNotification('Profile has been updated'));
      setTimeout(onSuccess, 0);
    } catch (err) {
      setErrors(Validate.parseResponseError(err.response));
      dispatch(addValidationErrorNotification());
    }

    setLoading(false);
  };

  useEffect(() => {
    const data = cloneDeep(pick(user, USER_EDITABLE_PROPS));

    if (data.usersSources) {
      data.usersSources = data.usersSources.filter(item => item.sourceUrl);
    }

    setData(data);
  }, [user]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(data);
      }}
    >
      <div className={`${gridStyles.grid} ${gridStyles.profile}`}>
        <div className={gridStyles.sidebar}>
          <Menu
            sections={[
              { title: 'Personal Info', name: 'personalInfo' },
              { title: 'About Me', name: 'aboutMe' },
              { title: 'Links', name: 'links' },
            ]}
          />
        </div>
        <div className={gridStyles.content}>
          <h2 className={profileStyles.title}>Your Profile</h2>

          <Element
            name="personalInfo"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>Personal Info</h3>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Cover</div>
              <div className={profileStyles.data}>
                <DropzoneWrapper
                  className={profileStyles.cover}
                  accept="image/jpeg, image/png"
                >
                  {false ? (
                    <img src="https://cdn-images-1.medium.com/max/2600/1*Udttv_M-zfA2gmDrCLkMpA.jpeg" alt="" />
                  ) : (
                    <IconCover />
                  )}
                </DropzoneWrapper>
              </div>
            </div>

            <div className={`${profileStyles.field} ${profileStyles.fieldUpload}`}>
              <div className={profileStyles.label}>Photo</div>
              <div className={profileStyles.data}>
                <DropzoneWrapper
                  className={profileStyles.upload}
                  accept="image/jpeg, image/png, image/gif"
                  onChange={(avatarFilename) => {
                    setAvatarPreview(URL.createObjectURL(avatarFilename));
                    setDataAndValidate({ ...data, avatarFilename });
                  }}
                >
                  <div className={profileStyles.uploadIcon}>
                    {avatarPreview || data.avatarFilename ? (
                      <UserPick src={avatarPreview || urls.getFileUrl(data.avatarFilename)} size={100} shadow />
                    ) : (
                      <IconUser />
                    )}
                  </div>
                  <div className={profileStyles.uploadText}>
                    Drag and drop. We support JPG, PNG or GIF files. Max file size 0,5 Mb.
                  </div>
                </DropzoneWrapper>
              </div>
            </div>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Displayed Name</div>
              <div className={profileStyles.data}>
                <TextInput
                  submited={submited}
                  placeholder="Nickname or name, maybe emoji…"
                  value={data.firstName}
                  error={errors && errors.firstName}
                  onChange={(firstName) => {
                    setDataAndValidate({ ...data, firstName });
                  }}
                />
              </div>
            </div>
          </Element>

          <Element
            name="aboutMe"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>About Me</h3>
            <Textarea
              rows={5}
              submited={submited}
              placeholder="Your story, what passions you — something you want others to know about you"
              className={profileStyles.textarea}
              value={data.about}
              error={errors && errors.about}
              onChange={(about) => {
                setDataAndValidate({ ...data, about });
              }}
            />
          </Element>

          <Element
            name="links"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>Links</h3>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>My Website</div>
              <div className={profileStyles.data}>
                <TextInput
                  submited={submited}
                  placeholder="https://site.com"
                  value={data.personalWebsiteUrl}
                  error={errors && errors.personalWebsiteUrl}
                  onChange={(personalWebsiteUrl) => {
                    setDataAndValidate({ ...data, personalWebsiteUrl });
                  }}
                />
              </div>
            </div>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Social Networks</div>
              <div className={`${profileStyles.data} ${profileStyles.entrys}`}>
                {data.usersSources && data.usersSources.map((item, index) => (
                  <div className={`${profileStyles.entry} ${profileStyles.input}`} key={index}>
                    <TextInput
                      submited={submited}
                      placeholder="http://example.com"
                      value={item.sourceUrl}
                      error={errors && errors.usersSources && errors.usersSources[index] && errors.usersSources[index].sourceUrl}
                      onChange={(sourceUrl) => {
                        const { usersSources } = data;
                        usersSources[index].sourceUrl = sourceUrl;
                        setDataAndValidate({ ...data, usersSources });
                      }}
                    />
                    <span
                      role="presentation"
                      className={profileStyles.remove}
                      onClick={() => {
                        const { usersSources } = data;
                        usersSources.splice(index, 1);
                        setDataAndValidate({ ...data, usersSources });
                      }}
                    >
                      <IconRemove />
                    </span>
                  </div>
                ))}

                <div>
                  <Button
                    small
                    type="button"
                    onClick={() => {
                      const { usersSources } = data;
                      usersSources.push({ sourceUrl: '' });
                      setDataAndValidate({ ...data, usersSources });
                    }}
                  >
                    {data.socialNetworks && data.socialNetworks.length > 0 ? 'Add Another' : 'Add Network'}
                  </Button>
                </div>
              </div>
            </div>
          </Element>
        </div>
      </div>
    </form>
  );
};

Profile.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default Profile;
