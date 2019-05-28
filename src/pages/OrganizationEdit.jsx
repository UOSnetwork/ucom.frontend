import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Element } from 'react-scroll';
import urls from '../utils/urls';
import { getUserById } from '../store/users';
import { saveOrganization } from '../actions/organization';
import { selectUser } from '../store/selectors/user';
import Popup from '../components/Popup';
import Content from '../components/Popup/Content';
import VerticalMenu from '../components/VerticalMenu/index';
import styles from './Profile.css';
import TextInput from '../components/TextInput';
import Textarea from '../components/Textarea';
import Button from '../components/Button/index';
import Avatar from '../components/EntryHeader/Avatar';
import SocialNetworks from '../components/SocialNetworks';
import UsersTeamForm from '../components/UsersTeamForm/index';
import { getOrganizationById } from '../store/organizations';
import { validator, isValid } from '../utils/validateFields';
import EntryCard from '../components/EntryCard/index';

const Organization = (props) => {
  const owner = getUserById(props.users, props.user.id);
  const organization = getOrganizationById(props.organizations, props.organizationId);
  const [orgData, setOrgData] = useState(owner);
  const [errors, setErrors] = useState({});

  console.log(organization);

  if (!organization) {
    return null;
  }

  useEffect(() => {
    setOrgData({
      ...orgData,
      id: organization.id,
      title: organization.title,
      nickname: organization.nickname,
      avatarFilename: organization.avatarFilename,
      about: organization.about,
      email: organization.email,
      phoneNumber: organization.phoneNumber,
      country: organization.country,
      city: organization.city,
      usersTeam: organization.usersTeam,
      personalWebsiteUrl: organization.personalWebsiteUrl,
      socialNetworks: organization.socialNetworks || [],
      communitySources: organization.communitySources,
      partnershipSources: organization.partnershipSources,
    });
  }, (organization));

  const saveProfile = () => {
    orgData.usersSources = orgData.usersSources.filter(e => (e.sourceUrl));
    const checkError = validator(orgData);
    setErrors(checkError);

    if (isValid(checkError)) {
      // props.updateUser(orgData);
      console.log('orgData111: ', orgData);
      props.saveOrganization(orgData);
      props.onClickClose();
    }

    console.log('orgData222: ', orgData);
  };

  return (
    <div className={styles.page}>
      <Popup
        onClickClose={props.onClickClose}
        paddingBottom="50vh"
        id="org-popup"
      >
        <Content onClickClose={props.onClickClose}>
          <div className={styles.profile}>
            <div>
              <div className={styles.sidebar}>
                <VerticalMenu
                  sections={[
                    { name: 'General', title: 'General' },
                    { name: 'Board', title: 'Board' },
                    { name: 'About', title: 'About' },
                    { name: 'Contacts', title: 'Contacts' },
                    { name: 'Links', title: 'Links' },
                    { name: 'Location', title: 'Location' },
                  ]}
                  scrollerOptions={{
                    spy: true,
                    duration: 500,
                    delay: 100,
                    offset: -110,
                    smooth: true,
                    containerId: 'org-popup',
                  }}
                />
                {owner &&
                  <div className={styles.btnSaveOrg}>
                    <Button
                      onClick={() => saveProfile()}
                    >
                      Save Changes
                    </Button>
                  </div>
                }
              </div>
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <h2 className={styles.title}>{owner ? 'Edit Community Profile' : 'New Community'}</h2>
                {/* <p>Few words about profile its how it will affect autoupdates and etc. Maybe some tips)</p> */}
              </div>

              <div>
                <Element name="General" className={styles.section}>
                  <h3 className={styles.title}>General</h3>
                  <div className={styles.field}>
                    <div className={styles.label}>Emblem</div>
                    <div className={styles.avatarBlock}>
                      <div className={styles.avatar}>
                        <Avatar
                          organization
                          changeEnabled
                          src={urls.getFileUrl(orgData.avatarFilename)}
                          onChange={async (file) => {
                            setOrgData({ ...orgData, avatarFilename: file.preview });
                            props.saveOrganization({
                              avatarFilename: file,
                              nickname: orgData.nickname,
                              title: orgData.title,
                            });
                          }}
                        />
                      </div>
                      <div>
                        Drag and drop. We support JPG, PNG or GIF files. Max file size 5 Mb.
                      </div>
                    </div>
                  </div>
                  <div className={classNames(styles.field, styles.fieldRequired)}>
                    <div className={styles.label}>Community Name</div>
                    <div className={styles.inputBlock}>
                      <TextInput
                        topLabel
                        isRequired
                        placeholder="Choose Nice Name"
                        // className={styles.input}
                        value={orgData.title}
                        error={errors.title}
                        onChange={value => setOrgData({ ...orgData, title: value })}
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <div className={styles.label}>Community Link</div>
                    <div className={styles.inputBlock}>
                      <TextInput
                        topLabel
                        placeholder="uosnetwork"
                        // className={styles.input}
                        value={orgData.nickname}
                        onChange={value => setOrgData({ ...orgData, nickname: value })}
                      />
                    </div>
                  </div>
                </Element>
                <Element name="Board" className={styles.section}>
                  <h3 className={styles.title}>Board</h3>
                  <div className={styles.field}>
                    <div className={styles.label}>Owner</div>
                    <div className={styles.inputBlock}>
                      <Link
                        to={urls.getUserUrl(organization.user.id)}
                        className={styles.userCard}
                        target="_blank"
                      >
                        <EntryCard
                          disableRate
                          disabledLink
                          id={organization.user.id}
                          title={organization.user.firstName}
                          nickname={organization.user.accountName}
                          url={urls.getUserUrl(organization.user.id)}
                          avatarSrc={urls.getFileUrl(organization.user.avatarFilename)}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className={classNames(styles.field, styles.fieldSoical)}>
                    <div className={styles.label}>Administrators</div>
                    <div className={styles.inputBlock}>
                      <UsersTeamForm
                        users={orgData.usersTeam}
                        onChange={(usersTeam) => {
                          setOrgData({ ...orgData, usersTeam });
                        }}
                      />
                    </div>
                  </div>
                </Element>
                <Element name="About" className={styles.section}>
                  <h3 className={styles.title}>About</h3>
                  <div className={styles.textarea}>
                    <Textarea
                      placeholder="Main idea — something you want others to know about this community…"
                      rows={6}
                      value={orgData.about}
                      onChange={value => setOrgData({ ...orgData, about: value })}
                      isMentioned
                    />
                  </div>
                </Element>
                <Element name="Contacts" className={styles.section}>
                  <h3 className={styles.title}>Contacts</h3>
                  <div className={styles.field}>
                    <div className={styles.label}>Email</div>
                    <div className={styles.inputBlock}>
                      <TextInput
                        // topLabel
                        placeholder="example@mail.com"
                        // className={styles.input}
                        value={orgData.email}
                        onChange={value => setOrgData({ ...orgData, email: value })}
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <div className={styles.label}>Phone Number</div>
                    <div className={styles.inputBlock}>
                      <TextInput
                        // topLabel
                        // placeholder=""
                        // className={styles.input}
                        value={orgData.phoneNumber}
                        onChange={value => setOrgData({ ...orgData, phoneNumber: value })}
                      />
                    </div>
                  </div>
                </Element>
                <Element name="Links" className={styles.section}>
                  <h3 className={styles.title}>Links</h3>
                  <div className={styles.field}>
                    <div className={styles.label}>Community Website</div>
                    <div className={styles.inputBlock}>
                      <TextInput
                      // className={styles.input}
                        value={orgData.personalWebsiteUrl}
                        onChange={value => setOrgData({ ...orgData, personalWebsiteUrl: value })}
                      />
                    </div>
                  </div>
                  <SocialNetworks
                    fields={orgData.socialNetworks}
                    onChange={value => setOrgData({ ...orgData, socialNetworks: value })}
                    // errors={errors}
                  />
                </Element>
                <Element name="Location" className={styles.section}>
                  <h3 className={styles.title}>Location</h3>
                  <div className={styles.field}>
                    <div className={styles.label}>Country</div>
                    <div className={styles.inputBlock}>
                      <TextInput
                        topLabel
                        placeholder="Your country"
                        // className={styles.input}
                        value={orgData.country}
                        onChange={value => setOrgData({ ...orgData, country: value })}
                      />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <div className={styles.label}>City</div>
                    <div className={styles.inputBlock}>
                      <TextInput
                        topLabel
                        placeholder="Your city"
                        // className={styles.input}
                        value={orgData.city}
                        onChange={value => setOrgData({ ...orgData, city: value })}
                      />
                    </div>
                  </div>
                </Element>
              </div>
            </div>
          </div>
        </Content>
      </Popup>
    </div>
  );
};

Organization.propTypes = {
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  saveOrganization: PropTypes.func.isRequired,
  onClickClose: PropTypes.func,
  organizationId: PropTypes.number,
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
};

export default connect(
  state => ({
    users: state.users,
    user: selectUser(state),
    organizations: state.organizations,
    organization: state.organization,
  }),
  dispatch => bindActionCreators({
    saveOrganization,
  }, dispatch),
)(Organization);
