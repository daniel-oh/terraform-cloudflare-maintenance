const white_list = WHITE_LIST_IPS.split(',');

addEventListener("fetch", event => {
  event.respondWith(fetchAndReplace(event.request))
})

async function fetchAndReplace(request) {

  let modifiedHeaders = new Headers()

  modifiedHeaders.set('Content-Type', 'text/html')
  modifiedHeaders.append('Pragma', 'no-cache')


  //Allow users from trusted into site
  if (white_list.indexOf(request.headers.get("cf-connecting-ip")) > -1)
  {
    //Fire all other requests directly to our WebServers
    return fetch(request)
  }
  else //Return maint page if you're not calling from a trusted IP
  {
    // Return modified response.
    return new Response(maintanencePage(COMPANY_NAME, LOGO_URL, FONT, EMAIL), {
      status: 503,
      headers: modifiedHeaders
    })
  }
}

let maintanencePage = (company_name, logo_url, font, email) => `
<!doctype html>

<head>
    <title>Site Maintenance</title>
    <link href="https://fonts.googleapis.com/css2?family=${font}&display=swap" rel="stylesheet">
    <link rel="icon" href="${logo_url}">
    </link>
    <style>
        body {
            text-align: center;
            font-family: "${font}", sans-serif;
            color: #0C1231;
        }

        .logo {
            margin-top: 3rem;
            max-height: 60px;
            width: auto;
        }

        .content {
            margin: 0 auto;
            max-width: 1000px;
        }

        .info {
            max-width: 500px;
            margin: 0 auto;
            margin-top: 6rem;
        }

        h1 {
            font-weight: 600;
            font-size: 41px;
        }

        .image-main {
            margin-top: 4rem;
        }

        hr {
            border: 1px solid rgba(0, 0, 0, 0.08);

            margin: 0px 10px;
            margin-top: 6rem;
            margin-bottom: 3rem;
        }

        a {
            text-decoration: none;
            color: #535353;
        }

        a:hover {
            color: #0C1231;
        }
    </style>
</head>

<body>
    <div class="content">
        <img class="logo" src="${logo_url}" alt="${company_name}">
        <div class="info">
            <h1>Our site is currently down for maintanence</h1>
            <p>We apologize for any inconveniences caused and will be online as soon as possible. Please check again in a little while. Thank you!</p>
            <p>&mdash; ${company_name}</p>
        </div>
        <img class="image-main" src="https://i.imgur.com/0uJkCM8.png" alt="Maintenance image">
        <hr />
        <a href="mailto:${email}?subject=Maintenance">You can reach us at: ${email}</a>
    </div>
</body>
`;
