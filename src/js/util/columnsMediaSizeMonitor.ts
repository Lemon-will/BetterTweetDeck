export enum TweetDeckColumnMediaPreviewSizesEnum {
  OFF = 'off',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
}

const columnMediaSizes: Map<string, TweetDeckColumnMediaPreviewSizesEnum> = new Map();

function isTargetHTMLElement(blob: any): blob is HTMLElement {
  return Boolean(blob.closest);
}

export function getSizeForColumnKey(columnKey = '') {
  return columnMediaSizes.get(columnKey) || TweetDeckColumnMediaPreviewSizesEnum.MEDIUM;
}

/** Will listen for columns changes in TweetDeck and update a map (`columnMediaSizes`) as needed */
export const monitorMediaSizes = () => {
  $(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
    if (!isTargetHTMLElement(ev.target)) {
      return;
    }

    if (!ev.target) {
      return;
    }

    // @ts-ignore
    const id = ev.target.closest('.js-column').getAttribute('data-column');
    const size = data.value;

    if (!id) {
      return;
    }

    columnMediaSizes.set(id, size);
  });

  $(document).on('dataColumns', (ev, data) => {
    const cols = data.columns.filter((col: any) => col.model.state.settings).map((col: any) => ({
      id: col.model.privateState.key,
      mediaSize: col.model.state.settings.media_preview_size
    }));

    if (columnMediaSizes.size !== cols.length) {
      columnMediaSizes.clear();
    }

    cols.filter((col: any) => col.id).forEach((col: any) => {
      columnMediaSizes.set(col.id, col.mediaSize || 'medium');
    });
  });
};