import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background: ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  #root {
    width: 100%;
    height: 100%;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.main};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.background.hover};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.background.disabled};
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    color: inherit;
  }

  input, select, textarea {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .focusable:focus {
    outline: none;
  }
`;

export { GlobalStyle };
