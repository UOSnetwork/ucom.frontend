import { Element } from 'react-scroll';
import { connect } from 'react-redux';
import React from 'react';
import VerticalMenu from './VerticalMenu';
import TextInput from './TextInput';
import UsersTeamForm from './UsersTeamForm';
import Textarea from './Textarea';
import Button from './Button';
import DropZone from './DropZone';
import Avatar from './Avatar';
import AvatarFromFile from './AvatarFromFile';
import SourcesForm from './SourcesForm';
import {
  setOrganizationActiveTab,
  setOrganizationData,
  setOrganizationActiveSection,
  setOrganizationEntitySource,
  addOrganizationCommunitiesNetwork,
  removeOrganizationCommunitiesNetwork,
  addOrganizationPartnershipNetwork,
  removeOrganizationPartnershipNetwork,
  saveOrganization,
} from '../actions/organization';
import { selectUser } from '../store/selectors';
import { getSourceNameById } from '../utils/organization';
import api from '../api';
import {
  STEPS_ID_GENERAL,
  STEPS_ID_COMMUNITY,
  STEPS_ID_CONTACTS,
} from '../store/organization';
import urls from '../utils/urls';
import OrganizationIcon from './Icons/Organization';

const OrganizationsCreatePage = (props) => {
  switch (props.organization.activeStepId) {
    case STEPS_ID_GENERAL: {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.setOrganizationActiveTab(STEPS_ID_COMMUNITY);
          }}
        >
          <div className="grid grid_settings">
            <div className="grid__item grid__item_side">
              <VerticalMenu
                sections={[
                  { name: 'MainInfo', title: 'Main Info' },
                  { name: 'Location', title: 'Location' },
                ]}
              />
            </div>
            <div className="grid__item grid__item_main">
              <div className="fields">
                <Element name="MainInfo">
                  <div className="fields__title">
                    <h1 className="title title_small">Main Info</h1>
                  </div>

                  <div className="fields__item">
                    <div className="field field_avatar">
                      <div className="field__label">
                        <div className="field__section">Logotype</div>
                        <div className="field__section">
                          {props.organization.data.avatarFilename && typeof props.organization.data.avatarFilename === 'object' ? (
                            <AvatarFromFile square rounded BlankIcon={OrganizationIcon} size="big" file={props.organization.data.avatarFilename} />
                          ) : (
                            <Avatar BlankIcon={OrganizationIcon} square rounded size="big" src={urls.getFileUrl(props.organization.data.avatarFilename)} />
                          )}
                        </div>
                      </div>
                      <div className="field__input">
                        <div className="field__section">
                          <DropZone
                            onDrop={file => props.setOrganizationData({ avatarFilename: file })}
                            text="Add or drag img"
                          />
                        </div>
                        <div className="field__section">
                          <div className="field__hint">
                            You can upload an image in JPG or PNG format. Size is not more than 1 mb.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Community name</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          isRequired
                          placeholder="Type something..."
                          value={props.organization.data.title}
                          onChange={title => props.setOrganizationData({ title })}
                          error={props.organization.errors.title && props.organization.errors.title[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">@organization slug</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          isRequired
                          placeholder="mycommunity"
                          value={props.organization.data.nickname}
                          onChange={nickname => props.setOrganizationData({ nickname })}
                          error={props.organization.errors.nickname && props.organization.errors.nickname[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Asset to show</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          placeholder="UOS"
                          value={props.organization.data.currencyToShow}
                          onChange={currencyToShow => props.setOrganizationData({ currencyToShow })}
                          error={props.organization.errors.currencyToShow && props.organization.errors.currencyToShow[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">On board</div>
                      <div className="field__input">
                        <UsersTeamForm
                          users={props.organization.data.usersTeam}
                          onChange={(usersTeam) => {
                            props.setOrganizationData({ usersTeam });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Powered by</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          placeholder="UOS"
                          value={props.organization.data.poweredBy}
                          onChange={poweredBy => props.setOrganizationData({ poweredBy })}
                          error={props.organization.errors.poweredBy && props.organization.errors.poweredBy[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Your idea</div>
                      <div className="field__input">
                        <Textarea
                          isMentioned
                          placeholder="Type something..."
                          rows={4}
                          value={props.organization.data.about}
                          onChange={about => props.setOrganizationData({ about })}
                          error={props.organization.errors.about && props.organization.errors.about[0]}
                        />
                      </div>
                    </div>
                  </div>
                </Element>

                <Element name="Location">
                  <div className="fields__title">
                    <h1 className="title title_small">Location</h1>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Country</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          value={props.organization.data.country}
                          onChange={country => props.setOrganizationData({ country })}
                          error={props.organization.errors.country && props.organization.errors.country[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">City</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          value={props.organization.data.city}
                          onChange={city => props.setOrganizationData({ city })}
                          error={props.organization.errors.city && props.organization.errors.city[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Address</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          subtext="Actual address. Example: One Apple Park Way, Cupertino, CA 95014, USA"
                          value={props.organization.data.address}
                          onChange={address => props.setOrganizationData({ address })}
                          error={props.organization.errors.address && props.organization.errors.address[0]}
                        />
                      </div>
                    </div>
                  </div>
                </Element>

                <div className="fields__item">
                  <div className="field">
                    <div className="field__input">
                      <Button type="submit" text="PROCEED" theme="red" size="big" isDisabled={!props.organization.isValid} isStretched />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      );
    }

    case STEPS_ID_COMMUNITY: {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.setOrganizationActiveTab(STEPS_ID_CONTACTS);
          }}
        >
          <div className="grid grid_settings">
            <div className="grid__item grid__item_side">
              <VerticalMenu
                sections={[
                  { name: 'Communities', title: 'Communities' },
                  { name: 'Partners', title: 'Partners' },
                ]}
              />
            </div>
            <div className="grid__item grid__item_main">
              <div className="fields">
                <Element name="Communities">
                  <div className="fields__title">
                    <h1 className="title title_small">Communities</h1>
                  </div>

                  <SourcesForm
                    loadOptions={api.searchCommunity}
                    list={props.organization.data.communitySources}
                    onClickRemove={index => props.removeOrganizationCommunitiesNetwork(index)}
                    onSearch={data => props.addOrganizationCommunitiesNetwork(data)}
                    onSubmit={data => props.addOrganizationCommunitiesNetwork(data)}
                    placeholder="Find or add community"
                    fieldPrefix="Community"
                  />

                  <div className="fields__title">
                    <h1 className="title title_small">Partners</h1>
                  </div>

                  <SourcesForm
                    loadOptions={api.searchPartnership}
                    list={props.organization.data.partnershipSources}
                    onClickRemove={index => props.removeOrganizationPartnershipNetwork(index)}
                    onSearch={data => props.addOrganizationPartnershipNetwork(data)}
                    onSubmit={data => props.addOrganizationPartnershipNetwork(data)}
                    placeholder="Find or add partner"
                    fieldPrefix="Partner"
                  />

                  <div className="fields__item">
                    <div className="field field_reverse">
                      <div className="field__input">
                        <Button type="submit" text="PROCEED" theme="red" size="big" isDisabled={!props.organization.isValid} isStretched />
                      </div>
                    </div>
                  </div>
                </Element>
              </div>
            </div>
          </div>
        </form>
      );
    }

    case STEPS_ID_CONTACTS: {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.saveOrganization(props.organization.data);
          }}
        >
          <div className="grid grid_settings">
            <div className="grid__item grid__item_side">
              <VerticalMenu
                sections={[
                  { name: 'Contacts', title: 'Contacts' },
                  { name: 'SocialNetworks', title: 'Social Networks' },
                ]}
              />
            </div>
            <div className="grid__item grid__item_main">
              <div className="fields">
                <Element name="Contacts">
                  <div className="fields__title">
                    <h1 className="title title_small">Contacts</h1>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Email</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          value={props.organization.data.email}
                          onChange={email => props.setOrganizationData({ email })}
                          error={props.organization.errors.email && props.organization.errors.email[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Phone number</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          value={props.organization.data.phoneNumber}
                          onChange={phoneNumber => props.setOrganizationData({ phoneNumber })}
                          error={props.organization.errors.phoneNumber && props.organization.errors.phoneNumber[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="fields__item">
                    <div className="field">
                      <div className="field__label">Your web-site</div>
                      <div className="field__input">
                        <TextInput
                          touched
                          topLabel
                          value={props.organization.data.personalWebsiteUrl}
                          onChange={personalWebsiteUrl => props.setOrganizationData({ personalWebsiteUrl })}
                          error={props.organization.errors.personalWebsiteUrl && props.organization.errors.personalWebsiteUrl[0]}
                        />
                      </div>
                    </div>
                  </div>
                </Element>

                <Element name="SocialNetworks">
                  <div className="fields__title">
                    <h1 className="title title_small">Social networks</h1>
                  </div>

                  {props.organization.data.socialNetworks.map((item, index) => (
                    <div className="fields__item" key={index}>
                      <div className="field">
                        <div className="field__label">{getSourceNameById(item.sourceTypeId)}</div>
                        <div className="field__input">
                          <TextInput
                            topLabel
                            value={props.organization.data.socialNetworks
                              .find(source => source.sourceTypeId === item.sourceTypeId).sourceUrl}
                            onChange={sourceUrl => props.setOrganizationEntitySource({
                              sourceUrl,
                              sourceTypeId: item.sourceTypeId,
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </Element>

                <div className="fields__item">
                  <div className="field">
                    <div className="field__label" />
                    <div className="field__input">
                      <Button
                        isStretched
                        type="submit"
                        text="FINISH"
                        theme="red"
                        size="big"
                        isDisabled={!props.organization.isValid || props.organization.loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      );
    }

    default: {
      return null;
    }
  }
};

export default connect(
  state => ({
    organization: state.organization,
    user: selectUser(state),
  }),
  dispatch => ({
    setOrganizationActiveTab: tabId => dispatch(setOrganizationActiveTab(tabId)),
    setOrganizationData: data => dispatch(setOrganizationData(data)),
    setOrganizationActiveSection: sectionId => dispatch(setOrganizationActiveSection(sectionId)),
    setOrganizationEntitySource: data => dispatch(setOrganizationEntitySource(data)),
    addOrganizationCommunitiesNetwork: data => dispatch(addOrganizationCommunitiesNetwork(data)),
    removeOrganizationCommunitiesNetwork: index => dispatch(removeOrganizationCommunitiesNetwork(index)),
    addOrganizationPartnershipNetwork: data => dispatch(addOrganizationPartnershipNetwork(data)),
    removeOrganizationPartnershipNetwork: index => dispatch(removeOrganizationPartnershipNetwork(index)),
    saveOrganization: data => dispatch(saveOrganization(data)),
  }),
)(OrganizationsCreatePage);
