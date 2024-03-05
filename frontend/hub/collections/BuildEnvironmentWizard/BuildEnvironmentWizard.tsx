import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LoadingPage,
  PageHeader,
  PageLayout,
  PageWizard,
  PageWizardStep,
  useGetPageUrl,
  usePageAlertToaster,
} from '../../../../framework';
import { HubRoute } from '../../main/HubRoutes';
import { hubErrorAdapter } from '../../common/adapters/hubErrorAdapter';
import { Collection } from '../Collection';
import { SelectCollectionsStep } from './steps/SelectCollectionsStep';

export interface BuildEnvironment {
  collections: Collection[];
}

export function BuildEnvironmentWizard() {
  const { t } = useTranslation();
  const getPageUrl = useGetPageUrl();

  const steps: PageWizardStep[] = [
    {
      id: 'select-collections',
      label: t('Select collections'),
      inputs: <SelectCollectionsStep />,
      //   hidden: () => !template.ask_inventory_on_launch,
    },
  ];

  const handleSubmit = async (data: BuildEnvironment) => {
    // const job = await postRequest(awxAPI`/job_templates/${resourceId}/launch/`, payload);
  };

  const initialValues = {
    selectCollections: {
      collections: null,
    },
  };

  return (
    <PageLayout>
      <PageHeader
        title={t('Build Environment')}
        breadcrumbs={[
          { label: t('Collections'), to: getPageUrl(HubRoute.Collections) },
          { label: t('Build environment') },
        ]}
      />
      <PageWizard<BuildEnvironment>
        steps={steps}
        defaultValue={initialValues}
        onSubmit={handleSubmit}
        errorAdapter={hubErrorAdapter}
      />
    </PageLayout>
  );
}
