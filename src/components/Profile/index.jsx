import PropTypes from 'prop-types';
import { pick, isEqual, cloneDeep } from 'lodash';
import { connect } from 'react-redux';
import React, { useState, useEffect, memo } from 'react';
import { Element } from 'react-scroll';
import profileStyles from './styles.css';
import gridStyles from '../Grid/styles.css';
import DropzoneWrapper from '../DropzoneWrapper';
import IconUser from '../Icons/User';
import TextInput from '../TextInput';
import Textarea from '../TextareaAutosize';
import Button from '../Button/index';
import IconRemove from '../Icons/Remove';
import VerticalMenu from '../VerticalMenu';
import UserPick from '../UserPick/UserPick';
import { getUserById } from '../../store/users';
import urls from '../../utils/urls';
import validator from '../../utils/validate';
import { updateUser } from '../../actions/users';
import { addErrorNotification, addSuccessNotification } from '../../actions/notifications';
import withLoader from '../../utils/withLoader';

const USER_EDITABLE_PROPS = [
  'avatarFilename',
  'firstName',
  'about',
  'usersSources',
  'personalWebsiteUrl',
];

const Profile = ({
  user, updateUser, addErrorNotification, addSuccessNotification, onSuccess,
}) => {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(undefined);

  const validate = (data) => {
    const errors = validator(data, {
      personalWebsiteUrl: {
        url: true,
      },
      firstName: {
        presence: {
          allowEmpty: false,
        },
      },
      about: {
        length: {
          maximum: 1024,
        },
      },
      usersSources: {
        array: {
          sourceUrl: {
            presence: true,
            url: true,
          },
        },
      },
    });

    setErrors(errors);

    const hasErrors = !!errors;
    const isValid = !hasErrors;

    return isValid;
  };

  const setDataAndValidate = (data) => {
    setData(data);
    validate(data);
  };

  const submit = async (data) => {
    const isValid = validate(data);

    setSubmited(true);

    if (!isValid || loading) {
      return;
    }

    setLoading(true);

    try {
      await withLoader(updateUser(data));
      addSuccessNotification('Profile has been updated');
      setTimeout(onSuccess, 0);
    } catch (err) {
      addErrorNotification(err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    setData(cloneDeep(pick(user, USER_EDITABLE_PROPS)));
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
          <div className={profileStyles.menu}>
            <VerticalMenu
              sections={[
                { title: 'Personal Info', name: 'personalInfo' },
                { title: 'About Me', name: 'aboutMe' },
                { title: 'Links', name: 'links' },
              ]}
              scrollerOptions={{
                spy: true,
                duration: 500,
                delay: 100,
                offset: -73,
                smooth: true,
                containerId: 'profile-popup',
              }}
            />
          </div>
          <Button
            red
            strech
            type="submit"
          >
            Create
          </Button>
        </div>
        <div className={gridStyles.content}>
          <h2 className={profileStyles.title}>Your Profile</h2>

          <p className={profileStyles.description}>
            Few words about profile its how it will affect autoupdates and etc.<br />
            Maybe some tips)
          </p>

          <Element
            name="personalInfo"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>Personal Info</h3>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Photo</div>
              <div className={profileStyles.data}>
                <DropzoneWrapper
                  className={profileStyles.upload}
                  accept="image/jpeg, image/png"
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
                  error={errors && errors.firstName && errors.firstName[0]}
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
              error={errors && errors.about && errors.about[0]}
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
                  error={errors && errors.personalWebsiteUrl && errors.personalWebsiteUrl[0]}
                  onChange={(personalWebsiteUrl) => {
                    setDataAndValidate({ ...data, personalWebsiteUrl });
                  }}
                />
              </div>
            </div>

            {data.usersSources && data.usersSources.map((item, index) => (
              <div
                key={index}
                className={profileStyles.field}
              >
                {index === 0 &&
                  <div className={profileStyles.label}>Social Networks</div>
                }
                <div className={profileStyles.data}>
                  <TextInput
                    submited={submited}
                    placeholder="https://github.com/username"
                    value={item.sourceUrl}
                    error={errors && errors.usersSources && errors.usersSources[0][index] && errors.usersSources[0][index].sourceUrl[0]}
                    onChange={(sourceUrl) => {
                      const { usersSources } = data;
                      usersSources[index].sourceUrl = sourceUrl;
                      setDataAndValidate({ ...data, usersSources });
                    }}
                  />
                  {data.usersSources && data.usersSources.length > 1 &&
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
                  }
                </div>
              </div>
            ))}

            <div className={profileStyles.field}>
              {(!data.usersSources || data.usersSources.length === 0) &&
                <div className={profileStyles.label}>Social Networks</div>
              }
              <div className={profileStyles.data}>
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
                    {data.usersSources && data.usersSources.length > 0 ? 'Add Another' : 'Add Profile'}
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
  user: PropTypes.shape({
    avatarFilename: PropTypes.string,
    firstName: PropTypes.string,
    about: PropTypes.string,
    usersSources: PropTypes.arrayOf(PropTypes.shape({
      sourceUrl: PropTypes.string,
    })),
    personalWebsiteUrl: PropTypes.string,
  }),
  updateUser: PropTypes.func.isRequired,
  addErrorNotification: PropTypes.func.isRequired,
  addSuccessNotification: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  user: undefined,
};

export default connect(state => ({
  user: getUserById(state.users, state.user.data.id),
}), {
  updateUser,
  addErrorNotification,
  addSuccessNotification,
})(memo(Profile, (prev, next) => (
  isEqual(pick(prev.user, USER_EDITABLE_PROPS), pick(next.user, USER_EDITABLE_PROPS))
)));
