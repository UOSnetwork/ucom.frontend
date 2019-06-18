import PropTypes from 'prop-types';
import { Element } from 'react-scroll';
import { isEqual, pick, cloneDeep, uniqBy } from 'lodash';
import { connect } from 'react-redux';
import React, { memo, useState, useEffect } from 'react';
import { getOrganizationById } from '../../store/organizations';
import { getUserById } from '../../store/users';
import gridStyles from '../Grid/styles.css';
import profileStyles from './styles.css';
import Menu from './Menu';
import DropzoneWrapper from '../DropzoneWrapper';
import IconOrganization from '../Icons/Organization';
import IconRemove from '../Icons/Remove';
import TextInput from '../TextInput';
import Textarea from '../TextareaAutosize';
import EntryCard from '../EntryCard';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import Button from '../Button/index';
import UserSearchInput from '../UserSearchInput';
import Validate from '../../utils/validate';
import UserPick from '../UserPick/UserPick';
import { getUsersTeamStatusById, SOURCE_TYPE_EXTERNAL } from '../../utils/organization';
import api from '../../api';
import { validUrl, extractSitename } from '../../utils/url';
import EmbedService from '../../utils/embedService';
import withLoader from '../../utils/withLoader';
import { addSuccessNotification, addValidationErrorNotification } from '../../actions/notifications';
import { updateOrganization } from '../../actions/organizations';

const ORGANIZATION_EDITABLE_PROPS = [
  'id',
  'title',
  'nickname',
  'avatarFilename',
  'about',
  'country',
  'city',
  'email',
  'phoneNumber',
  'personalWebsiteUrl',
  'socialNetworks',
  'usersTeam',
  'partnershipSources',
];

const OrganizationProfile = ({
  owner,
  organization,
  onSuccess,
  addSuccessNotification,
  addValidationErrorNotification,
  updateOrganization,
}) => {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(undefined);
  const [adminSearchVisible, setAdminSearchVisible] = useState(false);
  const [partnersSearchVisible, setPartnersSearchVisible] = useState(false);

  const validate = (data) => {
    const { errors, isValid } = Validate.validateOrganization(data);

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
      addValidationErrorNotification();
    }

    if (!isValid || loading) {
      return;
    }

    setLoading(true);

    try {
      await withLoader(updateOrganization(data));
      addSuccessNotification('Profile has been updated');
      setTimeout(onSuccess, 0);
    } catch (err) {
      setErrors(Validate.parseResponseError(err.response));
      addValidationErrorNotification();
    }

    setLoading(false);
  };

  useEffect(() => {
    const data = cloneDeep(pick(organization, ORGANIZATION_EDITABLE_PROPS));

    if (data && data.socialNetworks) {
      data.socialNetworks = data.socialNetworks.filter(item => item.sourceUrl);
    }

    setData(data);
  }, [organization]);

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
              { title: 'General', name: 'general' },
              { title: 'Board', name: 'board' },
              { title: 'About', name: 'about' },
              { title: 'Contacts', name: 'contacts' },
              { title: 'Links', name: 'links' },
              { title: 'Location', name: 'cocation' },
            ]}
          />
        </div>
        <div className={gridStyles.content}>
          <h2 className={profileStyles.title}>New Community</h2>

          <p className={profileStyles.description}>
            Few words about profile its how it will affect autoupdates and etc.<br />
            Maybe some tips)
          </p>

          <Element
            name="general"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>General</h3>

            <div className={`${profileStyles.field} ${profileStyles.block}`}>
              <div className={profileStyles.label}>Emblem</div>
              <div className={profileStyles.data}>
                <DropzoneWrapper
                  className={profileStyles.upload}
                  accept="image/jpeg, image/png, image/gif"
                  onChange={(avatarFilename) => {
                    setAvatarPreview(URL.createObjectURL(avatarFilename));
                    setDataAndValidate({ ...data, avatarFilename });
                  }}
                >
                  <div className={`${profileStyles.uploadIcon} ${profileStyles.org}`}>
                    {avatarPreview || data.avatarFilename ? (
                      <UserPick src={avatarPreview || urls.getFileUrl(data.avatarFilename)} size={100} shadow organization />
                    ) : (
                      <IconOrganization />
                    )}
                  </div>
                  <div className={profileStyles.uploadText}>
                    Drag and drop. We support JPG, PNG or GIF files. Max file size 0,5 Mb.
                  </div>
                </DropzoneWrapper>
              </div>
            </div>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Community Name</div>
              <div className={profileStyles.data}>
                <TextInput
                  submited={submited}
                  placeholder="Choose Nice Name"
                  value={data.title}
                  error={errors && errors.title}
                  onChange={(title) => {
                    setDataAndValidate({ ...data, title });
                  }}
                />
              </div>
            </div>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Community Link</div>
              <div className={profileStyles.data}>
                <TextInput
                  submited={submited}
                  placeholder="datalightsus"
                  prefix="u.community/"
                  value={data.nickname}
                  error={errors && errors.nickname}
                  onChange={(nickname) => {
                    setDataAndValidate({ ...data, nickname });
                  }}
                />
              </div>
            </div>
          </Element>

          <Element
            name="board"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>Board</h3>

            <div className={`${profileStyles.field} ${profileStyles.block}`}>
              <div className={profileStyles.label}>Owner</div>
              <div className={profileStyles.data}>
                {owner &&
                  <EntryCard
                    disableRate
                    avatarSrc={urls.getFileUrl(owner.avatarFilename)}
                    url={urls.getUserUrl(owner.id)}
                    title={getUserName(owner)}
                    nickname={owner.accountName}
                  />
                }
              </div>
            </div>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Administraors</div>
              <div className={`${profileStyles.data} ${profileStyles.entrys}`}>
                {data.usersTeam && data.usersTeam.map((item, index) => (
                  <div
                    key={index}
                    className={profileStyles.entry}
                  >
                    <EntryCard
                      disableRate
                      avatarSrc={urls.getFileUrl(item.avatarFilename)}
                      url={urls.getUserUrl(item.id)}
                      title={getUserName(item)}
                      nickname={item.accountName}
                    />
                    <span className={profileStyles.adminStatus}>{getUsersTeamStatusById(item.usersTeamStatus)}</span>
                    <span
                      role="presentation"
                      className={`${profileStyles.remove} ${profileStyles.medium}`}
                      onClick={() => {
                        const { usersTeam } = data;
                        usersTeam.splice(index, 1);
                        setDataAndValidate({ ...data, usersTeam });
                      }}
                    >
                      <IconRemove />
                    </span>
                  </div>
                ))}
                {adminSearchVisible &&
                  <UserSearchInput
                    autoFocus
                    value={[]}
                    onChange={(users) => {
                      const user = users[0];
                      const usersTeam = uniqBy(data.usersTeam.concat(user).filter(i => i.id !== owner.id), 'id');
                      setDataAndValidate({ ...data, usersTeam });
                      setAdminSearchVisible(false);
                    }}
                  />
                }
                <div>
                  <Button
                    small
                    type="button"
                    disabled={adminSearchVisible}
                    onClick={() => setAdminSearchVisible(true)}
                  >
                    Add Admin
                  </Button>
                </div>
              </div>
            </div>
          </Element>

          <Element
            name="about"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>About</h3>

            <Textarea
              rows={5}
              submited={submited}
              placeholder="Main idea — something you want others to know about this community…"
              className={profileStyles.textarea}
              value={data.about}
              error={errors && errors.about}
              onChange={(about) => {
                setDataAndValidate({ ...data, about });
              }}
            />
          </Element>

          <Element
            name="contacts"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>Contacts</h3>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Email</div>
              <div className={profileStyles.data}>
                <TextInput
                  type="email"
                  submited={submited}
                  placeholder="example@mail.com"
                  value={data.email}
                  error={errors && errors.email}
                  onChange={(email) => {
                    setDataAndValidate({ ...data, email });
                  }}
                />
              </div>
            </div>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Phone Number</div>
              <div className={profileStyles.data}>
                <TextInput
                  type="tel"
                  submited={submited}
                  placeholder="8 800 200 06 00 88 88"
                  value={data.phoneNumber}
                  error={errors && errors.phoneNumber}
                  onChange={(phoneNumber) => {
                    setDataAndValidate({ ...data, phoneNumber });
                  }}
                />
              </div>
            </div>
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
                  placeholder="http://example.com"
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
                {data.socialNetworks && data.socialNetworks.map((item, index) => (
                  <div className={`${profileStyles.entry} ${profileStyles.input}`} key={index}>
                    <TextInput
                      submited={submited}
                      placeholder="http://example.com"
                      value={item.sourceUrl}
                      error={errors && errors.socialNetworks && errors.socialNetworks[index] && errors.socialNetworks[index].sourceUrl}
                      onChange={(sourceUrl) => {
                        const { socialNetworks } = data;
                        socialNetworks[index].sourceUrl = sourceUrl;
                        setDataAndValidate({ ...data, socialNetworks });
                      }}
                    />
                    <span
                      role="presentation"
                      className={profileStyles.remove}
                      onClick={() => {
                        const { socialNetworks } = data;
                        socialNetworks.splice(index, 1);
                        setDataAndValidate({ ...data, socialNetworks });
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
                      const { socialNetworks } = data;
                      socialNetworks.push({
                        sourceUrl: '',
                        sourceTypeId: 0,
                      });
                      setDataAndValidate({ ...data, socialNetworks });
                    }}
                  >
                    {data.socialNetworks && data.socialNetworks.length > 0 ? 'Add Another' : 'Add Network'}
                  </Button>
                </div>
              </div>
            </div>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Partners</div>
              <div className={`${profileStyles.data} ${profileStyles.entrys}`}>
                {data.partnershipSources && data.partnershipSources.map((item, index) => (
                  <div
                    key={index}
                    className={profileStyles.entry}
                  >
                    <EntryCard
                      disableRate
                      organization
                      disableSign={item.sourceType === SOURCE_TYPE_EXTERNAL}
                      isExternal={item.sourceType === SOURCE_TYPE_EXTERNAL}
                      avatarSrc={urls.getFileUrl(item.avatarFilename)}
                      url={item.sourceType === SOURCE_TYPE_EXTERNAL ? item.sourceUrl : urls.getOrganizationUrl(item.entityId)}
                      title={item.title}
                      nickname={item.sourceType === SOURCE_TYPE_EXTERNAL ? item.sourceUrl : item.nickname}
                    />
                    <span
                      role="presentation"
                      className={`${profileStyles.remove} ${profileStyles.medium}`}
                      onClick={() => {
                        const { partnershipSources } = data;
                        partnershipSources.splice(index, 1);
                        setDataAndValidate({ ...data, partnershipSources });
                      }}
                    >
                      <IconRemove />
                    </span>
                  </div>
                ))}
                {partnersSearchVisible &&
                  <UserSearchInput
                    autoFocus
                    organization
                    value={[]}
                    loadOptions={async (q) => {
                      if (validUrl(q)) {
                        try {
                          const data = await EmbedService.getDataFromUrl(q);

                          return [{
                            title: extractSitename(q),
                            description: data.description || extractSitename(q),
                            sourceUrl: q,
                            sourceType: SOURCE_TYPE_EXTERNAL,
                          }];
                        } catch (err) {
                          return [];
                        }
                      }

                      try {
                        const data = await api.searchCommunity(q);
                        return data.slice(0, 20);
                      } catch (err) {
                        return [];
                      }
                    }}
                    onChange={(organizations) => {
                      const organization = organizations[0];
                      const partnershipSources = data.partnershipSources.concat(organization);
                      setDataAndValidate({ ...data, partnershipSources });
                      setPartnersSearchVisible(false);
                    }}
                  />
                }
                <div>
                  <Button
                    small
                    type="button"
                    disabled={partnersSearchVisible}
                    onClick={() => setPartnersSearchVisible(true)}
                  >
                    {data.partnershipSources && data.partnershipSources.length > 0 ? 'Add Another' : 'Add Partner'}
                  </Button>
                </div>
              </div>
            </div>
          </Element>

          <Element
            name="cocation"
            className={profileStyles.section}
          >
            <h3 className={profileStyles.subTitle}>Location</h3>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>Country</div>
              <div className={profileStyles.data}>
                <TextInput
                  submited={submited}
                  value={data.country}
                  error={errors && errors.country}
                  onChange={(country) => {
                    setDataAndValidate({ ...data, country });
                  }}
                />
              </div>
            </div>

            <div className={profileStyles.field}>
              <div className={profileStyles.label}>City</div>
              <div className={profileStyles.data}>
                <TextInput
                  submited={submited}
                  value={data.city}
                  error={errors && errors.city}
                  onChange={(city) => {
                    setDataAndValidate({ ...data, city });
                  }}
                />
              </div>
            </div>
          </Element>
        </div>
      </div>
    </form>
  );
};

OrganizationProfile.propTypes = {
  owner: PropTypes.objectOf(PropTypes.any).isRequired,
  organization: PropTypes.objectOf(PropTypes.any).isRequired,
  onSuccess: PropTypes.func.isRequired,
  addSuccessNotification: PropTypes.func.isRequired,
  addValidationErrorNotification: PropTypes.func.isRequired,
  updateOrganization: PropTypes.func.isRequired,
};

export default connect((state, props) => {
  const organization = getOrganizationById(state.organizations, props.organizationId);
  const owner = getUserById(state.users, organization.userId);

  return { organization, owner };
}, {
  addSuccessNotification,
  updateOrganization,
  addValidationErrorNotification,
})(memo(OrganizationProfile, (prev, next) => (
  isEqual(pick(prev.organization, ORGANIZATION_EDITABLE_PROPS), pick(next.organization, ORGANIZATION_EDITABLE_PROPS))
)));
