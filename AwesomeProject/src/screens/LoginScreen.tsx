import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, LogBox, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ErrorScreen from './ErrorScreen';




const LoginScreen: React.FC = () => {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const authContext = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      authContext!.login(username, password).then(res => { console.log(res); }).catch(error => { console.log(error); }).finally(() => { setLoading(false) });
    }, 3000)
  };

  // // if(!authContext) {
  //  useEffect(()=>{
  //   setError({
  //     errorCode: "0000",
  //     errorPage: "LoginScreen",
  //     errorType: "app_error",
  //     errorMessage: "Auth context is missing"
  //   });
  //  }, [])
  // }


  if (!authContext) {
    return <ErrorScreen error={{ errorCode: "000", errorPage: "LoginScreen", errorType: "app_error", errorMessage: "AuthContext is not null" }} />
  }

  if (error && error.errorType === "app_error") {
    return <ErrorScreen error={error} />
  }
  return (
    <View style={styles.container}>
      {/* <Image source={require('./assets/instagram_logo.png')} style={styles.logo} /> */}
      <Text style={styles.welcomeText}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={!!isLoading}>
        {isLoading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 64,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
