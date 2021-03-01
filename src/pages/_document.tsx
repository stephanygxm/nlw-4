// em vez de usar as tags do próprio html, vai importar de dentro do document as tags do html
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    {/* como icon é o mesmo em todas as páginas, foi adicionado aqui */}
                    <link rel="shortcut icon" href="favicon.png" type="image/png" />

                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rajdhani:wght@600&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    {/* o main é onde vai ser mostrado a aplicação */}
                    <Main />
                    {/* o nextscript são alguns scripts que o next injeta na aplicação de forma automatizada */}
                    <NextScript />
                </body>
            </Html>
        );
    }
}