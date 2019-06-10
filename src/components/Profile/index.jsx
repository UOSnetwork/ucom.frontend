import React from 'react';
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

const Profile = () => {
  return (
    <div className={`${gridStyles.grid} ${gridStyles.profile}`}>
      <div className={gridStyles.sidebar}>
        <VerticalMenu
          sticky
          stickyTop={86}
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
                  <IconUser />
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
                placeholder="Nickname or name, maybe emoji…"
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
            onChange={() => {}}
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
              />
              <span className={profileStyles.remove}>
                <IconRemove />
              </span>
            </div>
          </div>
          <div className={profileStyles.field}>
            <div className={profileStyles.data}>
              <TextInput
                placeholder="https://site.com"
              />
              <span className={profileStyles.remove}>
                <IconRemove />
              </span>
            </div>
          </div>
          <div className={profileStyles.field}>
            <div className={profileStyles.data}>
              <div>
                <Button small>Add Another</Button>
              </div>
            </div>
          </div>

          <div className={profileStyles.field}>
            <div className={profileStyles.label}>My Website</div>
            <div className={profileStyles.data}>
              <TextInput
                placeholder="https://github.com/username"
              />
              <span className={profileStyles.remove}>
                <IconRemove />
              </span>
            </div>
          </div>
          <div className={profileStyles.field}>
            <div className={profileStyles.data}>
              <TextInput
                placeholder="https://instagram.com/username"
              />
              <span className={profileStyles.remove}>
                <IconRemove />
              </span>
            </div>
          </div>
          <div className={profileStyles.field}>
            <div className={profileStyles.data}>
              <div>
                <Button small>Add Another</Button>
              </div>
            </div>
          </div>
        </Element>
      </div>
      <div className={gridStyles.footer}>
        footer
      </div>
    </div>
  );
};

export default Profile;
