import { createStackNavigator } from 'react-navigation-stack';
import SignIn from '../screens/Signin';

const navigator = createStackNavigator({
	Signin: SignIn,
});

export default navigator;
