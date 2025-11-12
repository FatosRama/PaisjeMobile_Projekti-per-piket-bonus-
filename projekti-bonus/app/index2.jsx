import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import * as Facebook from 'expo-auth-session/providers/facebook';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const { facebookAppId } = Constants.expoConfig.extra;

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: facebookAppId,
  });

  useEffect(() => {
    if (response && response.type === 'success') {
      const { authentication } = response;
      console.log('Access token:', authentication.accessToken);
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        disabled={!request}
        title="Login with Facebook"
        onPress={() => promptAsync()}
      />
    </View>
  );
}
