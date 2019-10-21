import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Header from '../../components/Header';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	title: {
		fontSize: 34,
		fontWeight: 'bold',
		marginBottom: 10,
	},
});

class Orders extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			orders: [],
			store: {},
			loading: false,
			refreshing: false,
		};
		this.loadOrders = this.loadOrders.bind(this)
		this.onClose = this.onClose.bind(this)
	}

	componentDidMount() {
        const { navigation } = this.props;
        const store = navigation.getParam('store');
        const idCustomer = navigation.getParam('idCustomer');
        this.setState({ store, idCustomer }, () => this.loadOrders());
		// this.loadOrders();
	}

    // getStore() {
	// 	AsyncStorage.getItem('user')
	// 		.then((user) => {
	// 			api.stores.getInfo(user)
	// 				.then((store) => {
    //                     this.setState({store});
	// 					return api.orders.getAllCustomers(store.idStore)
	// 				})
	// 				.then((customers) => {
	// 					this.setState({ customers });
	// 				})
	// 				.catch((err) => Toast.show(err.message, Toast.LONG))
	// 		})
	// 		.catch((err) => Toast.show(err.message, Toast.LONG))
    // }
    
	loadOrders() {
        const {idCustomer, store} = this.state;
        this.setState({loading: true});
        
		api.orders.getByCustomers(idCustomer, store.idStore)
			.then((orders) => {
				this.setState({orders});
			})
			.catch((err) => {
				Toast.show(err.message, Toast.LONG);
			})
			.finally(() => {
				setTimeout(() => {
					this.setState({loading: false})
				},1000)
			});
    }
    
    onClose() {
        this.props.navigation.goBack();
    }

	_keyExtractor = (item, index) => String(item.idOrder);

	_itemSeparator = () => (
		<View
			style={{
				paddingVertical: 1,
				marginLeft: 70,
				backgroundColor: '#C3C3C3',
			}}
		/>
	);

	_renderOrders = ({item}) => {
		const date = new Date(item.createdAt).toLocaleString();
		return (
			<View
				style={{
					flexDirection: 'row',
					paddingVertical: 20,
					paddingHorizontal: 23,
					justifyContent: 'space-between',
				}}
			>
				<View
					style={{
						flexDirection: 'row',
					}}
				>
					<Icon name="history" size={40}/>
					<View
						style={{
							paddingLeft: 10,
						}}
					>
                        <Text style={{}}>Orden: {item.idOrder}</Text>
                        <Text style={{ fontWeight: 'bold' }}>{date.toString()}</Text>
                        <Text style={{ fontWeight: '300' }}>Pago: {item.withPoints ? `Puntos` : `Dinero`}</Text>
					</View>
				</View>
				<Text
					style={{
						fontSize: 19,
						fontWeight: 'bold',
						color: '#518E54'
					}}
				>${item.total}</Text>
			</View>
		)
	}

	render() {
        const { orders, loading } = this.state;
        
		return (
			<SafeAreaView
				style={styles.container}
			>
				<Header
                    action={this.onClose}
                    btnName="ios-close"
					title="Ordenes"
				/>
				<FlatList
					data={orders}
					renderItem={this._renderOrders}
					keyExtractor={this._keyExtractor}
					ItemSeparatorComponent={this._itemSeparator}
					onRefresh={() => this.loadOrders()}
					refreshing={loading}

				/>
			</SafeAreaView>
		);
	}
}

export default Orders;
