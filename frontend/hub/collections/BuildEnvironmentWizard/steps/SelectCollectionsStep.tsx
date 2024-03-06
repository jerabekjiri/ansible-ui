import { useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { CircleIcon, CheckCircleIcon } from "@patternfly/react-icons";

import { useHubView } from "../../../common/useHubView";
import { hubAPI } from "../../../common/api/formatPath";
import { collectionKeyFn } from "../../../common/api/hub-api-utils";
import { CollectionVersionSearch } from "../../Collection";
import { ITableColumn, PageTable, TextCell } from "../../../../../framework";
import { Label, PageSection, Stack, LabelGroup, Flex, FlexItem } from "@patternfly/react-core";
import { Scrollable } from "../../../../../framework";
import { PageLayout } from "../../../../../framework";
import { IToolbarFilter, ToolbarFilterType } from "../../../../../framework";

// move to common/utils/collectionId.tsx
import { collectionId } from "../../../administration/repositories/RepositoryPage/RepositoryCollectionVersion";

export function useCollectionFilters() {
  const { t } = useTranslation();

  return useMemo<IToolbarFilter[]>(
    () => [
      {
        key: 'keywords',
        label: t('Keywords'),
        type: ToolbarFilterType.SingleText,
        query: 'keywords',
        comparison: 'equals',
      },
      {
        key: 'namespace',
        label: t('Namespace'),
        type: ToolbarFilterType.SingleText,
        query: 'namespace',
        comparison: 'equals',
      },
    ],
    [t]
  );
}

export function useCollectionColumns() {
  const { t } = useTranslation();
  // const getPageUrl = useGetPageUrl();

  // const context = useHubContext();
  // const { display_signatures } = context.featureFlags;

  return useMemo<ITableColumn<CollectionVersionSearch>[]>(
    () => [
      {
        header: t('Name'),
        cell: (collection) => <Stack>
          <div>{collection.collection_version?.name}</div>
          <div>{collection.collection_version?.description}</div>
        </Stack>
      },
      {
        header: t('Version'),
        type: 'text',
        value: (collection) => collection.collection_version?.version,
        sort: 'version',
      },
      {
        header: t('Status'),
        cell: (item) => (
          <LabelGroup>
            <Label icon={<CircleIcon />} color="blue" isCompact>
              {t('Certified')}
            </Label>
            <Label icon={<CheckCircleIcon />} color="green" isCompact>
              {t('Signed')}
            </Label>
            <Label color="grey" isCompact>
              {t('Unsynced')}
            </Label>
        </LabelGroup>
        )
      },
    ],
    []
  );
}

export function SelectCollectionsStep() {

  const { t } = useTranslation()
  const tableColumns = useCollectionColumns();
  const toolbarFilters = useCollectionFilters();
  
  const [selectedCollections, setSelectedCollections] = useState<CollectionVersionSearch[]>([]);
  

  const view = useHubView<CollectionVersionSearch>({
    url: hubAPI`/v3/plugin/ansible/search/collection-versions/`,
    keyFn: collectionKeyFn,
    tableColumns,
    toolbarFilters,
    queryParams: {
      is_deprecated: 'false',
      repository_label: '!hide_from_search',
    }
    // defaultSelection: props.defaultSelection,

    // defaultFilters: { status: ['pipeline=staging'] },
  });

  return (
    <PageLayout>
      {Object.keys(selectedCollections).length !== 0 && (
        <Flex
          // justifyContent={{
            // default: noData
            //   ? 'justifyContentFlexStart'
            //   : 'justifyContentSpaceBetween',
          // }}
          direction={{ default: 'column' }}
        >
          <FlexItem>
            <Flex>
              <FlexItem>
                <strong>
                  <Trans>Selected collections</Trans>
                </strong>
              </FlexItem>

              <FlexItem flex={{ default: 'flex_1' }}>
                <Flex>
                  {selectedCollections.map((collection) => (
                    <FlexItem key={collectionId(collection)}>
                      <Label
                        onClose={() =>
                          setSelectedCollections(
                            selectedCollections.filter(
                              (c) => collectionId(c) !== collectionId(c),
                            ),
                          )
                        }
                      >
                        {collection?.collection_version?.name}
                      </Label>
                    </FlexItem>
                  ))}
                </Flex>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      )}

      <PageTable<CollectionVersionSearch>
        id="hub-select-collections-table"
        showSelect={true}
        {...view}
        selectedItems={selectedCollections}
        isSelectMultiple={true}
        isSelected={(item) =>
          selectedCollections.find((i) => collectionId(i) === collectionId(item)) ? true : false
        }
        selectItem={(item) => {
          const newItems = [...selectedCollections, item];
          setSelectedCollections(newItems);
        }}
        selectItems={(items) => {
          const newItems = [...selectedCollections, ...items];
          setSelectedCollections(newItems);
        }}
        unselectItem={(item) => {
          setSelectedCollections(
            selectedCollections.filter((item2) => collectionId(item2) !== collectionId(item))
          );
        }}
        unselectAll={() => {
          setSelectedCollections([]);
        }}
        tableColumns={tableColumns}
        toolbarFilters={toolbarFilters}
        errorStateTitle={t('Error loading collections')}
        emptyStateTitle={t('No selected collections')}
        defaultTableView="table"
        disableListView={true}
        disableCardView={true}
      />
    </PageLayout>
  )
}