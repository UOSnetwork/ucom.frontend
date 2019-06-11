import PropTypes from 'prop-types';
import { pick, isEqual } from 'lodash';
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

const USER_EDITABLE_PROPS = [
  'avatarFilename',
  'firstName',
  'about',
  'usersSources',
  'personalWebsiteUrl',
];

const Profile = ({ user }) => {
  const [state, setState] = useState({
    data: {},
    errors: undefined,
    loading: false,
    submited: false,
  });

  const [data, setData] = useState({});
  const [errors, setErrors] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState({});

  const validate = (data) => {
    setErrors(validator(data, {
      personalWebsiteUrl: {
        url: true,
        presence: true,
      },
      firstName: {
        presence: {
          allowEmpty: false,
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
    }));
  };

  const setDataAndValidate = (data) => {
    setData(data);
    validate(data);
  };

  const submit = (data) => {
    validate(data);
    setSubmited(true);
  };

  useEffect(() => {
    setData(pick(user, USER_EDITABLE_PROPS));
  }, [user]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(state.data);
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
                  onChange={(file) => {
                    console.log(file);
                  }}
                >
                  <div className={profileStyles.uploadIcon}>
                    {state.data.avatarFilename ? (
                      <UserPick src={urls.getFileUrl(state.data.avatarFilename)} size={100} shadow />
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
                  touched={submited}
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
              placeholder="Your story, what passions you — something you want others to know about you"
              className={profileStyles.textarea}
              value={state.data.about}
              onChange={(about) => {
                setState(prev => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    about,
                  },
                }));
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
                  placeholder="https://site.com"
                  value={data.personalWebsiteUrl}
                  error={errors && errors.personalWebsiteUrl && errors.personalWebsiteUrl[0]}
                  onChange={(personalWebsiteUrl) => {
                    setDataAndValidate({ ...data, personalWebsiteUrl });
                  }}
                />
              </div>
            </div>

            {state.data.usersSources && state.data.usersSources.map((item, index) => (
              <div
                key={index}
                className={profileStyles.field}
              >
                {index === 0 &&
                  <div className={profileStyles.label}>Social Networks</div>
                }
                <div className={profileStyles.data}>
                  <TextInput
                    placeholder="https://github.com/username"
                    value={item.sourceUrl}
                    onChange={(sourceUrl) => {
                      setState((prev) => {
                        const { usersSources } = prev.data;
                        usersSources[index].sourceUrl = sourceUrl;

                        return ({
                          ...prev,
                          data: {
                            ...prev.data,
                            usersSources,
                          },
                        });
                      });
                    }}
                  />
                  <span
                    role="presentation"
                    className={profileStyles.remove}
                    onClick={() => {
                      setState((prev) => {
                        const { usersSources } = prev.data;
                        usersSources.splice(index, 1);

                        return ({
                          ...prev,
                          data: {
                            ...prev.data,
                            usersSources,
                          },
                        });
                      });
                    }}
                  >
                    <IconRemove />
                  </span>
                </div>
              </div>
            ))}

            <div className={profileStyles.field}>
              {(!state.data.usersSources || state.data.usersSources.length === 0) &&
                <div className={profileStyles.label}>Social Networks</div>
              }
              <div className={profileStyles.data}>
                <div>
                  <Button
                    small
                    onClick={() => {
                      setState((prev) => {
                        const { usersSources } = prev.data;
                        usersSources.push({});

                        return ({
                          ...prev,
                          data: {
                            ...prev.data,
                            usersSources,
                          },
                        });
                      });
                    }}
                  >
                    Add Another
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
};

Profile.defaultProps = {
  user: undefined,
};

export default connect(state => ({
  user: getUserById(state.users, state.user.data.id),
}))(memo(Profile, (prev, next) => (
  isEqual(pick(prev.user, USER_EDITABLE_PROPS), pick(next.user, USER_EDITABLE_PROPS))
)));
