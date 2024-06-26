import { DropdownPosition } from '@patternfly/react-core/deprecated';
import { TrashIcon } from '@patternfly/react-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  IPageAction,
  LoadingPage,
  PageActionSelection,
  PageActionType,
  PageActions,
  PageHeader,
  PageLayout,
  useGetPageUrl,
  usePageNavigate,
} from '../../../../../framework';
import { PageRoutedTabs } from '../../../../common/PageRoutedTabs';
import { useGetItem } from '../../../../common/crud/useGet';
import { AwxError } from '../../../common/AwxError';
import { awxAPI } from '../../../common/api/awx-utils';
import { Token } from '../../../interfaces/Token';
import { AwxUser } from '../../../interfaces/User';
import { AwxRoute } from '../../../main/AwxRoutes';
import { useDeleteUserTokens } from '../hooks/useDeleteUserTokens';

export function UserTokenPage() {
  const { t } = useTranslation();
  const getPageUrl = useGetPageUrl();
  const pageNavigate = usePageNavigate();
  const params = useParams<{ id: string; tokenid: string }>();
  const { error: userError, data: user, refresh } = useGetItem<AwxUser>(awxAPI`/users`, params.id);
  const {
    error: tokenError,
    data: token,
    refresh: refreshToken,
  } = useGetItem<Token>(awxAPI`/tokens`, params.tokenid);

  const deleteTokens = useDeleteUserTokens((deleted: Token[]) => {
    if (deleted.length > 0) {
      pageNavigate(AwxRoute.UserTokens, { params: { id: params.id } });
    }
  });

  const itemActions: IPageAction<Token>[] = useMemo(() => {
    return [
      {
        type: PageActionType.Button,
        selection: PageActionSelection.Single,
        icon: TrashIcon,
        label: t('Delete token'),
        onClick: (token) => deleteTokens([token]),
        isDanger: true,
        isPinned: true,
      },
    ];
  }, [deleteTokens, t]);

  if (userError) return <AwxError error={userError} handleRefresh={refresh} />;
  if (tokenError) return <AwxError error={tokenError} handleRefresh={refreshToken} />;
  if (!token) return <LoadingPage breadcrumbs tabs />;

  return (
    <PageLayout>
      <PageHeader
        title={t('Token')}
        breadcrumbs={[
          { label: t('Users'), to: getPageUrl(AwxRoute.Users) },
          {
            label: user?.username,
            to: getPageUrl(AwxRoute.UserDetails, { params: { id: params.id } }),
          },
          {
            label: t('Tokens'),
            to: getPageUrl(AwxRoute.UserTokens, {
              params: { id: params.id, tokenid: params.tokenid },
            }),
          },
        ]}
        headerActions={
          <PageActions<Token>
            actions={itemActions}
            position={DropdownPosition.right}
            selectedItem={token}
          />
        }
      ></PageHeader>
      <PageRoutedTabs
        backTab={{
          label: t('Back to User Tokens'),
          page: AwxRoute.UserTokens,
          persistentFilterKey: 'user tokens',
        }}
        tabs={[{ label: t('Details'), page: AwxRoute.UserTokenDetails }]}
        params={{ id: params.id, tokenid: params.tokenid }}
      />
    </PageLayout>
  );
}
