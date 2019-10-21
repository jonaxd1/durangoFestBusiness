/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
import React from 'react';
import {
	View,
	Text,
	TextInput,
	ImageBackground,
	StyleSheet,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	TouchableOpacity,
	Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Toast from 'react-native-simple-toast';

import api from '../../api';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	// formContainer: {
	// 	position: 'absolute',
	// 	left: 0,
	// 	right: 0,
	// 	bottom: 0,
	// 	height: 200,
	// 	padding: 20,
	// },
	// logoContainer: {
	// 	alignItems: 'center',
	// 	justifyContent: 'center',
	// 	flex: 1,
	// },
	title: {
		fontSize: 32,
		color: '#FFF',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	input: {
		height: 40,
		backgroundColor: 'rgba(255,255,255,0.8)',
		color: '#000',
		paddingHorizontal: 10,
		marginBottom: 10,
		borderRadius: 30,
	},
	buttonContainer: {
		backgroundColor: '#f7c744',
		paddingVertical: 15,
		borderRadius: 30,
	},
	buttonText: {
		textAlign: 'center',
		color: '#1E1E1E',
		fontWeight: 'bold',
		fontSize: 18,
	},
});

class SignIn extends React.Component {
	static navigationOptions = {
		header: null,
	}

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
	}

	signin = () => {
		const { email, password } = this.state;
		api.auth.signin({ email, password })
			.then(() => {
				const { navigation } = this.props;
				navigation.navigate('App');
			})
			.catch((err) => {
				Toast.show(err.message, Toast.LONG);
			});
	}

	render() {
		return (
			<ImageBackground
				source={require('../../assets/images/bg.jpg')}
				style={{ width: '100%', height: '100%' }}
			>
				<SafeAreaView
					style={styles.container}
				>
					<KeyboardAvoidingView
						behavior="padding"
					>
						<TouchableWithoutFeedback
							onPress={Keyboard.dismiss}
						>
							<View>
								<View style={{ marginTop: 80}}>
									<Text style={styles.title}>Durango Fest</Text>
									<Text style={[styles.title, {fontSize: 38}]}>Bussines</Text>
								</View>
								<View
									style={{marginHorizontal: 15, marginTop: 200 }}
								>
									<TextInput
										style={styles.input}
										placeholder="Email"
										onChangeText={email => this.setState({ email })}
										keyboardType="email-address"
										autoCapitalize="none"
										autoCompleteType="email"
										returnKeyType="next"
										placeholderTextColor="#1C1C1C"
									/>
									<TextInput
										style={styles.input}
										placeholder="Password"
										onChangeText={password => this.setState({ password })}
										secureTextEntry
										returnKeyType="done"
										placeholderTextColor="#1C1C1C"
										autoCorrect={false}
									/>
									<TouchableOpacity
										style={styles.buttonContainer}
										onPress={this.signin}
									>
										<Text style={styles.buttonText}>Iniciar Sesión</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</ImageBackground>
		);
	}
}

export default SignIn;
