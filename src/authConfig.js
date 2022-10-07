export const msalConfig = {
    auth: {
        clientId: "f4632c58-3cc0-4238-b74b-1be5cbb440de", // This is the ONLY mandatory field that you need to supply.
        authority: "https://login.microsoftonline.com/organizations",  // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};