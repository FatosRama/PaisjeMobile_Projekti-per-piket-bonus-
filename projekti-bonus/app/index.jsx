import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { 
  auth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  GithubAuthProvider, 
  OAuthProvider, 
  signInWithCredential 
} from '../firebase'; // adjust path

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const {
    googleWebClientId,
    facebookAppId,
    githubClientId,
    githubClientSecret,
    microsoftClientId,
    microsoftClientSecret
  } = Constants.expoConfig.extra;

  // ---------- Google ----------
  const [gRequest, gResponse, gPromptAsync] = Google.useAuthRequest({
    clientId: googleWebClientId,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (gResponse?.type === 'success') {
      const { id_token } = gResponse.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(u => console.log('Google user:', u.user))
        .catch(e => console.log(e));
    }
  }, [gResponse]);

  // ---------- Facebook ----------
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: facebookAppId,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { authentication } = fbResponse;
      const credential = FacebookAuthProvider.credential(authentication.accessToken);
      signInWithCredential(auth, credential)
        .then(u => console.log('Facebook user:', u.user))
        .catch(e => console.log(e));
    }
  }, [fbResponse]);

  // ---------- GitHub ----------
  const githubDiscovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
  };

  const [ghRequest, ghResponse, ghPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: githubClientId,
      scopes: ['read:user', 'user:email'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    },
    githubDiscovery
  );

  useEffect(() => {
    if (ghResponse?.type === 'success') {
      const { code } = ghResponse.params;
      const getToken = async () => {
        const res = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ client_id: githubClientId, client_secret: githubClientSecret, code }),
        });
        const { access_token } = await res.json();
        const credential = GithubAuthProvider.credential(access_token);
        signInWithCredential(auth, credential)
          .then(u => console.log('GitHub user:', u.user))
          .catch(e => console.log(e));
      };
      getToken();
    }
  }, [ghResponse]);

  // ---------- Microsoft ----------
  const msDiscovery = {
    authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  };

  const [msRequest, msResponse, msPromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: microsoftClientId,
      scopes: ['User.Read'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      responseType: 'code',
    },
    msDiscovery
  );

  useEffect(() => {
    if (msResponse?.type === 'success') {
      const { code } = msResponse.params;
      const getToken = async () => {
        const tokenRes = await fetch(msDiscovery.tokenEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `client_id=${microsoftClientId}&client_secret=${microsoftClientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(AuthSession.makeRedirectUri({ useProxy: true }))}`,
        });
        const { access_token } = await tokenRes.json();
        const credential = OAuthProvider.credential(access_token);
        signInWithCredential(auth, credential)
          .then(u => console.log('Microsoft user:', u.user))
          .catch(e => console.log(e));
      };
      getToken();
    }
  }, [msResponse]);

  // ---------- Apple (iOS only) ----------
  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const firebaseCredential = OAuthProvider.credential(credential.identityToken);
      signInWithCredential(auth, firebaseCredential)
        .then(u => console.log('Apple user:', u.user))
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 }}>
      <Button disabled={!gRequest} title="Login with Google" onPress={() => gPromptAsync()} />
      <Button disabled={!fbRequest} title="Login with Facebook" onPress={() => fbPromptAsync()} />
      <Button disabled={!ghRequest} title="Login with GitHub" onPress={() => ghPromptAsync()} />
      <Button disabled={!msRequest} title="Login with Microsoft" onPress={() => msPromptAsync()} />
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 44 }}
        onPress={signInWithApple}
      />
    </View>
  );
}
