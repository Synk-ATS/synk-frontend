/* eslint-disable react/no-array-index-key */
import React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import { Provider as StyletronProvider } from 'styletron-react';
import styletron from '../lib/styletron';

class MyDocument extends Document {
  static getInitialProps = async (context) => {
    const renderPage = () => context.renderPage({
      // eslint-disable-next-line func-names
      enhanceApp: (App) => function (props) {
        return (
          <StyletronProvider value={styletron}>
            <App {...props} />
          </StyletronProvider>
        );
      },
    });

    const initialProps = await Document.getInitialProps({
      ...context,
      renderPage,
    });
    const stylesheets = styletron.getStylesheets() || [];
    return { ...initialProps, stylesheets };
  };

  render() {
    return (
      <Html>
        <Head>
          {this.props.stylesheets.map((sheet, i) => (
            <style
              className="_styletron_hydrate_"
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
              key={i}
            />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
