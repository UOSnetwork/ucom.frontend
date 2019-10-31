import { useTranslation } from 'react-i18next';
import React from 'react';

const RegistrationStepIntro = () => {
  const { t } = useTranslation();

  return (
    <div className="registration__intro">
      <div className="registration__title registration__title_intro">
        <h2 className="title">{t('accountCreation')}</h2>
      </div>
    </div>
  );
};

export default RegistrationStepIntro;
