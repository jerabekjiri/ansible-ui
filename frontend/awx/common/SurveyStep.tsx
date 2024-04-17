import { useTranslation } from 'react-i18next';
import { PageFormSection } from '../../../framework/PageForm/Utils/PageFormSection';
import { PageFormSelect, PageFormTextArea, PageFormTextInput } from '../../../framework';
import { usePageWizard } from '../../../framework/PageWizard/PageWizardProvider';
import { useGet } from '../../common/crud/useGet';
import { awxAPI } from './api/awx-utils';
import { Spec, Survey } from '../interfaces/Survey';
import { PageSelectOption } from '../../../framework/PageInputs/PageSelectOption';
import { PageFormCreatableSelect } from '../../../framework/PageForm/Inputs/PageFormCreatableSelect';
import { WizardFormValues } from '../resources/templates/WorkflowVisualizer/types';

export function SurveyStep({ templateId }: { templateId?: string }) {
  const { t } = useTranslation();
  const { wizardData } = usePageWizard();
  const { resource } = wizardData as WizardFormValues;
  const id = resource ? resource.id.toString() : templateId ? templateId : '';
  const { data: survey_spec } = useGet<Survey>(awxAPI`/job_templates/${id}/survey_spec/`);

  const choicesTo: PageSelectOption<string>[] = [];
  survey_spec?.spec.map((element: Spec) => {
    if (element.type === 'multiplechoice' && Array.isArray(element.choices)) {
      element.choices?.map((choice: string) => {
        choicesTo.push({ value: choice, label: t(choice) });
      });
    }
  });

  return (
    <PageFormSection>
      {survey_spec?.spec.map((element, index) =>
        element.type === 'text' ? (
          <PageFormTextInput
            key={index}
            name={`survey.${element.question_name}`}
            label={t(element.question_name)}
            isRequired={element.required}
            type="text"
            maxLength={element.max}
            minLength={element.min}
          />
        ) : element.type === 'integer' ? (
          <PageFormTextInput
            key={index}
            name={`survey.${element.question_name}`}
            label={t(element.question_name)}
            isRequired={element.required}
            type="number"
            max={element.max}
            min={element.min}
          />
        ) : element.type === 'float' ? (
          <PageFormTextInput
            key={index}
            name={`survey.${element.question_name}`}
            label={t(element.question_name)}
            isRequired={element.required}
            type="number"
            max={element.max}
            min={element.min}
          />
        ) : element.type === 'password' ? (
          <PageFormTextInput
            key={index}
            name={`survey.${element.question_name}`}
            label={t(element.question_name)}
            isRequired={element.required}
            type="password"
            maxLength={element.max}
            minLength={element.min}
          />
        ) : element.type === 'textarea' ? (
          <PageFormTextArea
            key={index}
            name={`survey.${element.question_name}`}
            label={t(element.question_name)}
            isRequired={element.required}
            maxLength={element.max}
            minLength={element.min}
          ></PageFormTextArea>
        ) : element.type === 'multiplechoice' ? (
          <PageFormSelect
            name={`survey.${element.question_name}`}
            placeholderText={t('Select option')}
            label={t(element.question_name)}
            options={choicesTo}
            isRequired={element.required}
          ></PageFormSelect>
        ) : element.type === 'multiselect' ? (
          <PageFormCreatableSelect
            name={`survey.${element.variable}`}
            placeholderText={t('Select option(s)')}
            label={t(element.question_name)}
            options={choicesTo}
            isRequired={element.required}
          />
        ) : undefined
      )}
    </PageFormSection>
  );
}