import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Ionicicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Menu from '../screens/Menu';
import Confirmation from '../screens/Confirmation';
import ModifyProduct from '../screens/ModifyProduct';
import Sales from '../screens/Sales';
import Customers from '../screens/Customers';
import Account from '../screens/Account';
import Orders from '../screens/Orders';

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
		Clientes: {
			screen: Customers,
			navigationOptions: {
				tabBarLabel: 'Clientes',
				tabBarIcon: ({ tintColor }) => (
				  <Icon name="format-list-bulleted" size={28} color={tintColor} />
				)
			},
		},
		Cuenta: {
			screen: Account,
			navigationOptions: {
				tabBarLabel: 'Cuenta',
				tabBarIcon: ({ tintColor }) => (
				  <Icon name="store" size={28} color={tintColor} />
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
		Orders,
	},{
		mode: "modal",
		headerMode: "none",
	}
);

export default navigator;
