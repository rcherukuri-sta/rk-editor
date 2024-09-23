/**
 * @summary Common customized CK-Editor configuration
 * @file This file keeps the configuration that is build for the CK-Editor 5
 * @author Chandana Mahesh, Krishnaprasath Santhinivasan, Cherukuri Rajendra Kumar, Surya Kavutarapu, Balaji Ganesan, Fethi
 * @since Oct 19, 2021
 * @copyright 2021 - 2022 University of Kansas
 */

import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import FindAndReplace from '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import List from '@ckeditor/ckeditor5-list/src/list';
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersArrows from '@ckeditor/ckeditor5-special-characters/src/specialcharactersarrows';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';
import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical';
import SpecialCharactersText from '@ckeditor/ckeditor5-special-characters/src/specialcharacterstext';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableCaption from '@ckeditor/ckeditor5-table/src/tablecaption';
import TableCellProperties from '@ckeditor/ckeditor5-table/src/tablecellproperties';
import TableProperties from '@ckeditor/ckeditor5-table/src/tableproperties';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TableColumnResize from '@ckeditor/ckeditor5-table/src/tablecolumnresize';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';

// Elements that need not be have id attribute
export const unwantedElements = ['sup', 'sub', 's', 'u', 'em', 'strong', 'base', 'head', 'html', 'meta', 'script', 'style', 'title', 'br', 'mo', 'mi', 'mrow', 'munder', 'mover', 'math', 'munderover', 'mn', 'msubsup'];
const idElements = (new RegExp('^(?:(?!^' + unwantedElements.join('$|^') + '$)(\\w))*$'));

/**
 * Defines the default configurations that are required for CKEditor
 *
 * @namesapce editorConfig
 *
 */

/** configure the required colors - Hex Color Code format */
const fontColors = [
  {
    color: '#000000',
    label: 'Black'
  },
  {
    color: '#4d4d4d',
    label: 'Dim grey'
  },
  {
    color: '#999999',
    label: 'Grey'
  },
  {
    color: '#e6e6e6',
    label: 'Light grey'
  },
  {
    color: '#ffffff',
    label: 'White',
    hasBorder: true
  },
  {
    color: '#e64d4d',
    label: 'Red'
  },
  {
    color: '#c0392b',
    label: 'Strong red'
  },
  {
    color: '#e6994d',
    label: 'Orange'
  },
  {
    color: '#e5e64d',
    label: 'Yellow'
  },
  {
    color: '#99e64d',
    label: 'Light green'
  },
  {
    color: '#4de64d',
    label: 'Green'
  },
  {
    color: '#27ae60',
    label: 'Dark emerald'
  },
  {
    color: '#4de699',
    label: 'Aquamarine'
  },
  {
    color: '#4de5e6',
    label: 'Turquoise'
  },
  {
    color: '#4d99e6',
    label: 'Light blue'
  },
  {
    color: '#4d4de6',
    label: 'Blue'
  },
  {
    color: '#2980b9',
    label: 'Strong blue'
  },
  {
    color: '#994de6',
    label: 'Purple'
  }
];

/* Event handler for font Size */
function generatePtSetting(size) {
  return {
    model: size,
    title: size,
    view: {
      name: 'span',
      styles: {
        'font-size': `${size}pt`
      }
    }
  };
}

const editorConfig = {
  plugins: [
    Alignment,
    BlockQuote,
    Bold,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    Heading,
    HorizontalLine,
    Image,
    ImageInsert,
    ImageToolbar,
    ImageCaption,
    ImageResize,
    ImageStyle,
    Indent,
    Italic,
    List,
    ListStyle,
    PasteFromOffice,
    RemoveFormat,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersEssentials,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableProperties,
    TableToolbar,
    TableColumnResize,
    Underline,
    WordCount,
    GeneralHtmlSupport,
    CodeBlock
  ],
  fontSize: {
    options: [
      generatePtSetting('8'),
      generatePtSetting('9'),
      generatePtSetting('10'),
      generatePtSetting('11'),
      generatePtSetting('12'),
      generatePtSetting('14'),
      'default',
      generatePtSetting('16'),
      generatePtSetting('18'),
      generatePtSetting('20'),
      generatePtSetting('22'),
      generatePtSetting('24'),
      generatePtSetting('26'),
      generatePtSetting('36'),
      generatePtSetting('42'),
    ]
  },
  fontColor: {
    columns: 6,
    colors: fontColors,
  },
  fontBackgroundColor: {
    columns: 6,
    colors: fontColors,
  },
  toolbar: {
    items: [
    ],
    shouldNotGroupWhenFull: true
  },
  // Used to configure rendering engine for MathLive.
  math: {
    engine: 'mathjax',
    outputType: 'span',
    forceOutputType: false,
    enablePreview: false
  },
  language: 'en',
  codeBlock: {
    languages: [
      { language: 'java', label: 'Java', class: 'language-java line-numbers' },
      { language: 'javascript', label: 'JavaScript', class: 'language-javascript line-numbers' },
      { language: 'python', label: 'Python', class: 'language-python line-numbers' },
    ],
  },
  table: {
    contentToolbar: [
      'tableColumn',
      'tableRow',
      'mergeTableCells',
      'tableCellProperties',
      'tableProperties',
      'toggleTableCaption',
      'tableColumnResize'
    ],
    tableProperties: {
      // The default styles for tables in the editor and they should be synchronized with the content styles.
      defaultProperties: {
        borderStyle: 'solid',
        borderColor: 'hsl(0, 0%, 0%)',
        borderWidth: '2px'
      }
    },
    // The default styles for table cells in the editor and they should be synchronized with the content styles.
    tableCellProperties: {
      defaultProperties: {
        borderStyle: 'solid',
        borderColor: 'hsl(0, 0%, 0%)',
        borderWidth: '2px'
      }
    }
  },
  htmlSupport: {
    allow: [
      /* HTML features to allow */
      {
        name: /.*/,
        attributes: [ // if need to support anyother attributes in future, need to add here. (don't add events attribue, unless it is necessary)
          {
            key: /^(data-.*|aria-.*|contenteditable)$/i,
            value: true
          }
        ],
        classes: ['constructedResponse-placeholder', 'placeholder', 'cked-highlight', 'object-tag-accessibility', 'table-tag-accessibility', 'gap-match-placeholder', 'cked-codecompiler', 'cked-codesubmit', 'math-tex'],
        styles: true
      },
      {
        name: 'img',
        attributes: [ // if need to support anyother attributes in future, need to add here. (don't add events attribue, unless it is necessary)
          {
            key: /^(src|alt|data-.*|aria-.*)$/i,
            value: true
          }
        ],
        classes: true,
        styles: true
      },
      {
        name: /^(video|audio)$/i,
        attributes: [ // if need to support anyother attributes in future, need to add here. (don't add events attribue, unless it is necessary)
          {
            key: /^(src|alt|controls|data-.*|aria-.*)$/i,
            value: true
          }
        ],
        classes: true,
        styles: true
      },
      {
        name: idElements,
        attributes: [
          {
            key: 'id',
            value: true// planned to use this regex as value once setid is ready /^.*$/i
          }
        ]
      },

      // Enables <div>s with all inline styles (but no other attributes).
      {
        name: 'div',
        styles: true
      },

      // Adds support for style="color: *" to the already supported
      // <p> and <h2-h4> elements.
      {
        name: '/^(p|h[2-4])$/',
        styles: { 'color': true }
      },
    ],
    disallow: [
      /* HTML features to disallow */
      {
        name: /.*/,
        attributes: /^on.*$/i // disalllow events (onclick, onload, etc), added this to handle XSS just in case
      },
    ]
  }
};

export default editorConfig;
