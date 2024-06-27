import * as _ from 'lodash';
import { StylesConfig } from'react-select';

export const lightSelectStyles: StylesConfig = {
  option: (base, state) => ({
    ...base,
    color: '#262626',
    backgroundColor: state.isFocused ? '#f0f0f0' : '#ffffff',
    ':active': {
      backgroundColor: '#e0e0e0'
    }
  }),
  // the main box
  control: (base, state) => _.assign({}, base, {
    minHeight: '36px',
    border: state.isFocused ? 'none' : 'none',
    boxShadow: state.isFocused ? 'none' : 'none',
    borderRadius: '0px',
    fontFamily: 'Lato, Arial, SansSerif',
    fontSize: '10pt',
    background: state.isDisabled ? '#d0d0d0' : '#ffffff',
    color: state.isDisabled ? '#808080' : '#000000'
  }),
  
  menu: (base, state) => ({
    ...base,
    backgroundColor: '#ffffff',
    marginTop: 0,
    borderRadius: '0px',
    fontFamily: 'Lato, Arial, SansSerif',
    zIndex: 7000,
    minWidth: '200px',
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isDisabled ? '#808080' : base.color,
    '&:hover': {
      color: '#303030'
    },
    fontSize: '8pt',
  }),
  indicatorSeparator: (base, state) => ({
    ...base,
    backgroundColor: 'transparent',
    width: 0,
  }),
  placeholder: (base, state) => ({
    ...base,
    color: state.isDisabled ? '#808080' : base.color,
  }),
};

export const darkSelectStyles: StylesConfig = {
  option: (base, state) => _.assign({}, base, {
    color: '#c8c7c2',
    backgroundColor: state.isFocused ? '#101010' : '#000',
    ':active': {
      backgroundColor: '#3c3d3b'
    },
    fontFamily: 'Lato, Arial, SansSerif',
    fontSize: '10pt',
  }),
  control: (base, state) => _.assign({}, base, {
    // @ts-ignore - TODO: isSelected doesn't exist as a type, so double check this at some point
    border: state.isFocused ? '1px solid #505050' : (state.isSelected ? '1px solid #505050' : '1px solid #505050'),
    boxShadow: 'none',
    borderRadius: '8px',
    fontFamily: 'Lato, Arial, SansSerif',
    fontSize: '10pt',
    background: state.isDisabled ? '#000' : '#000',
    color: state.isDisabled ? '#a0a0a0' : '#f6f6f6',
    '&:hover': {
      border: state.isFocused ? '1px solid #505050' : '1px solid #505050'
    }
  }),
  menu: (base, state) => _.assign({}, base, {
    backgroundColor: '#000000',
    marginTop: '5px',
    borderRadius: '0px',
    minWidth: '200px',
    msOverFlorStyle: 'none',  /* IE and Edge */
    scrollBarWidth: 'none',  /* Firefox */
  }),
  dropdownIndicator: (base, state) => _.assign({}, base, {
    color: state.isDisabled ? '#808080' : base,
    '&:hover': {
      color: '#ffffff'
    },
    fontSize: '8pt',
  }),
  indicatorSeparator: (base, state) =>  _.assign({}, base, {
    backgroundColor: 'transparent',
    width: 0,
  }),
  placeholder: (base, state) =>  _.assign({}, base, {
    color: state.isDisabled ? '#808080' : base
  }),
  singleValue: (base, state) => _.assign({}, base, {
    color: state.isDisabled ? '#808080' : '#f6f6f6',
  })
};

export const editorSequenceSelectStyles: StylesConfig = {
  option: (base, state) => _.assign({}, base, {
    color: '#c8c7c2',
    backgroundColor: state.isFocused ? 'transparent' : '#000',
    ':active': {
      backgroundColor: '#3c3d3b'
    },
    fontFamily: 'Lato, Arial, SansSerif',
    fontSize: '10pt',
  }),
  control: (base, state) => _.assign({}, base, {
    border: '1px solid #505050',
    boxShadow: 'none',
    borderRadius: '8px',
    fontFamily: 'Lato, Arial, SansSerif',
    fontSize: '10pt',
    background: 'transparent',
    color: state.isDisabled ? '#a0a0a0' : '#f6f6f6',
    '&:hover': {
      border: state.isFocused ? '1px solid #505050' : '1px solid #505050'
    }
  }),
  menu: (base, state) => _.assign({}, base, {
    backgroundColor: '#000000',
    marginTop: '5px',
    borderRadius: '0px',
    minWidth: '200px',
    msOverFlorStyle: 'none',  /* IE and Edge */
    scrollBarWidth: 'none',  /* Firefox */
  }),
  dropdownIndicator: (base, state) => _.assign({}, base, {
    color: state.isDisabled ? '#808080' : base,
    '&:hover': {
      color: '#ffffff'
    },
    fontSize: '8pt',
  }),
  indicatorSeparator: (base, state) =>  _.assign({}, base, {
    backgroundColor: 'transparent',
    width: 0,
  }),
  placeholder: (base, state) =>  _.assign({}, base, {
    color: state.isDisabled ? '#808080' : base
  }),
  singleValue: (base, state) => _.assign({}, base, {
    color: state.isDisabled ? '#808080' : '#f6f6f6',
  }),
  // styles when the user searches the select box
  input: (base, state) => _.assign({}, base, {
    color: '#ffffff',
  }),
  // styles the parent container for width in this instance, change or disable if fixed width is not what we want.
  container: (base, state) => _.assign({}, base, {
    width: '200px',
  })
};

export const smallSelectStyles: StylesConfig = {
  option: (base, state) => _.assign({}, base, {
    color: '#262626',
    backgroundColor: state.isFocused ? '#f0f0f0' : '#ffffff',
    ':active': {
      backgroundColor: '#e0e0e0'
    }
  }),
  // the main box
  control: (base, state) => _.assign({}, base, {
    minHeight: '24px',
    height: '30px',
    border: state.isFocused ? 'none' : 'none',
    boxShadow: state.isFocused ? 'none' : 'none',
    borderRadius: '5px',
    fontFamily: 'Lato, Arial, SansSerif',
    fontSize: '10pt',
    background: state.isDisabled ? '#d0d0d0' : '#ffffff',
    color: state.isDisabled ? '#808080' : '#000000'
  }),
  valueContainer: (base, state) => _.assign({}, base, {
    height: '30px',
    padding: '0 6px'
  }),
  menu: (base, state) => _.assign({}, base, {
    backgroundColor: '#ffffff',
    marginTop: 0,
    borderRadius: '0px',
    fontFamily: 'Lato, Arial, SansSerif',
    zIndex: 7000,
    minWidth: '200px',
  }),
  dropdownIndicator: (base, state) => _.assign({}, base, {
    color: state.isDisabled ? '#808080' : base
  }),
  indicatorsContainer: (base, state) => ({
    ...base,
    height: '30px',
  }),
  indicatorSeparator: (base, state) =>  _.assign({}, base, {
    backgroundColor: 'transparent',
    width: 0,
  }),
  input: (base, state) => ({
    ...base,
    margin: '0px',
  }),
  placeholder: (base, state) =>  _.assign({}, base, {
    color: state.isDisabled ? '#808080' : base
  }),
};

export const episodeSelectStyles: StylesConfig = {
  option: (base, state) => _.assign({}, base, {
    color: '#262626',
    backgroundColor: state.isFocused ? '#f0f0f0' : '#ffffff',
    ':active': {
      backgroundColor: '#e0e0e0'
    },
    padding: '15px 10px'
  }),
  control: (base, state) => _.assign({}, base, {
    backgroundColor: state.isFocused ? '#fff' : 'transparent',
    color: state.isFocused ? '#000' : '#f0f0f0',
    border: 'none',
    boxShadow: 'none',
    borderRadius: '0px',
    fontFamily: 'Lato',
    fontSize: '12pt',
  }),
  menu: (base, state) => _.assign({}, base, {
    backgroundColor: '#fff',
    marginTop: 0,
    zIndex: 7000,
  }),
  indicatorSeparator: (base, state) => _.assign({}, base, {
    border: 'none',
    width: '0px'
  }),
  placeholder: (base, state) => _.assign({}, base, {
    color: 'inherit'
  }),
  singleValue: (base, state) => _.assign({}, base, {
    color: 'inherit',
  }),
  dropdownIndicator: (base, state) => _.assign({}, base, {
    color: state.isFocused ? '#000' : '#f0f0f0',
    '&:hover': {color: state.isFocused ? '#000' : '#fff'}
  }),
};
