import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Ionicicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Menu from '../screens/Menu';
import Confirmation from '../screens/Confirmation';
import ModifyProduct from '../screens/ModifyProduct';
import Sales from '../screens/Sales';

const BottomNavigator = createBottomTabNavigator(
	{
		Menu: {
			screen: Menu,
			navigationOptions: {
				tabBarIcon: ({ tintColor }) => (
				  <Ionicicon name="ios-today" size={28} color={tintColor} />
				)
			},
		},
		Ventas: {
			screen: Sales,
			navigationOptions: {
				tabBarLabel: 'Mis Ventas',
				tabBarIcon: ({ tintColor }) => (
				  <Icon name="chart-line" size={28} color={tintColor} />
				)
			},
		},
	}, {
		tabBarOptions: {
			style: {
				backgroundColor: '#EFEFEF',
			}
		}
	}
);

const navigator = createStackNavigator(
	{
		BottomNavigator,
		Confirmation: Confirmation,
		ModifyProduct,
	},{
		mode: "modal",
		headerMode: "none",
	}
);

export default navigator;
