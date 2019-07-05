import PropTypes from 'prop-types';
import { pick, cloneDeep } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
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
import { addValidationErrorNotification, addSuccessNotification, addErrorNotificationFromResponse } from '../../actions/notifications';
import { entityHasCover, entityAddCover, entityGetCoverUrl } from '../../utils/entityImages';
import api from '../../api';
import withLoader from '../../utils/withLoader';
import * as selectors from '../../store/selectors';
import Menu from './Menu';
import styles from './styles.css';

const USER_EDITABLE_PROPS = [
  'avatarFilename',
  'firstName',
  'about',
  'usersSources',
  'personalWebsiteUrl',
  'entityImages',
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
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <Menu
            sections={[
              { title: 'Personal Info', name: 'personalInfo' },
              { title: 'About Me', name: 'aboutMe' },
              { title: 'Links', name: 'links' },
            ]}
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>Your Profile</h2>

          <Element
            name="personalInfo"
            className={styles.section}
          >
            <h3 className={styles.subTitle}>Personal Info</h3>

            <div className={styles.field}>
              <div className={styles.label}>Cover</div>
              <div className={styles.data}>
                <DropzoneWrapper
                  className={styles.cover}
                  accept="image/jpeg, image/png"
                  onChange={async (file) => {
                    try {
                      const data = await api.uploadOneImage(file);
                      console.log(data);
                    } catch (err) {
                      dispatch(addErrorNotificationFromResponse(err));
                    }
                  }}
                >
                  {entityHasCover(data.entityImages) ? (
                    <img src={entityGetCoverUrl(data.entityImages)} alt="" />
                  ) : (
                    <IconCover />
                  )}
                </DropzoneWrapper>
              </div>
            </div>

            <div className={`${styles.field} ${styles.fieldUpload}`}>
              <div className={styles.label}>Photo</div>
              <div className={styles.data}>
                <DropzoneWrapper
                  className={styles.upload}
                  accept="image/jpeg, image/png, image/gif"
                  onChange={(avatarFilename) => {
                    setAvatarPreview(URL.createObjectURL(avatarFilename));
                    setDataAndValidate({ ...data, avatarFilename });
                  }}
                >
                  <div className={styles.uploadIcon}>
                    {avatarPreview || data.avatarFilename ? (
                      <UserPick src={avatarPreview || urls.getFileUrl(data.avatarFilename)} size={100} shadow />
                    ) : (
                      <IconUser />
                    )}
                  </div>
                  <div className={styles.uploadText}>
                    Drag and drop. We support JPG, PNG or GIF files. Max file size 0,5 Mb.
                  </div>
                </DropzoneWrapper>
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>Displayed Name</div>
              <div className={styles.data}>
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
            className={styles.section}
          >
            <h3 className={styles.subTitle}>About Me</h3>
            <Textarea
              rows={5}
              submited={submited}
              placeholder="Your story, what passions you — something you want others to know about you"
              className={styles.textarea}
              value={data.about}
              error={errors && errors.about}
              onChange={(about) => {
                setDataAndValidate({ ...data, about });
              }}
            />
          </Element>

          <Element
            name="links"
            className={styles.section}
          >
            <h3 className={styles.subTitle}>Links</h3>

            <div className={styles.field}>
              <div className={styles.label}>My Website</div>
              <div className={styles.data}>
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

            <div className={styles.field}>
              <div className={styles.label}>Social Networks</div>
              <div className={`${styles.data} ${styles.entrys}`}>
                {data.usersSources && data.usersSources.map((item, index) => (
                  <div className={`${styles.entry} ${styles.input}`} key={index}>
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
                      className={styles.remove}
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
