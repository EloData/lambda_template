export const welcomeTemplate = `
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>GoalFlow</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet" />

  <style>
    .button_instagram {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #ffffff;
      background: #A875EA;
      width: 100%;
      height: 50px;
      border-radius: 50px;
      text-decoration: none;
    }
  </style>

</head>

<body style="margin: 0; padding: 0">
  <table style="background-color: #f3f5f9">
    <tr>
      <td style="width: 50px"></td>
      <td>
        <table style="
              background-color: #f3f5f9;
              font-family: Poppins, sans-serif;
              max-width: 600px;
              min-width: 300px;
            ">
          <tr style="height: 10px">
            <td style="display: flex; justify-content: center;">
              <div class="logo">
                <img src="https://launchmotion.com.br/assets/logo_branco.png" alt="logo" style="height: 70px;">
              </div>
            </td>
          </tr>
          <tr>
            <td style="border-top: 4px solid #A875EA">
              <table style="
                    width: 100%;
                    background-color: #ffffff;
                    border-radius: 0px 0px 8px 8px;
                    padding: 0 30px;
                  ">
                <tr>
                  <td style="height: 20px"></td>
                  <td style="height: 20px"></td>
                </tr>
                <tr style="text-align: center">
                  <td style="width: 20px"></td>
                  <td>
                    <h2 style="
                          font-size: 26px;
                          color: #1A1A1A;
                          font-weight: 500;
                        ">
                      Boas vindas
                    </h2>
                  </td>
                  <td style="width: 20px"></td>
                </tr>
                <tr>
                  <td style="width: 20px"></td>
                  <td>
                    <div class="separator"></div>
                  </td>
                </tr>
                <tr>
                  <td style="width: 20px"></td>
                  <td style="
                        width: 88%;
                        font-size: 16px;
                        color: #6b7786;
                        line-height: 1.8;
                        text-align: justify;
                      ">
                    <p>
                      Estamos muito felizes em tê-lo conosco! A partir de agora, você receberá nossas atualizações,
                      novidades e conteúdos exclusivos diretamente em seu e-mail.
                    </p>
                    <p>
                      Se tiver alguma dúvida ou sugestão, não hesite em nos contatar. Sua opinião é muito importante
                      para nós! Você pode responder diretamente a este e-mail ou entrar em contato através do nosso
                      instagram.
                    </p>
                  </td>
                  <td style="width: 20px"></td>
                </tr>
                <tr>
                  <td style="width: 20px"></td>
                  <td style="width: 100%;">
                    <a href="https://www.instagram.com/launch_motion" class="button_instagram">Seguir a LaunchMotion</a>
                  </td>
                  <td style="width: 20px"></td>
                </tr>
                <tr style="height: 20px"></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="height: 20px"></td>
          </tr>
        </table>
      </td>
      <td style="width: 50px"></td>
    </tr>
  </table>
</body>

</html>
`;
