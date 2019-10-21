import React from 'react';
import {
	FlatList,
	Text,
	ImageBackground,
	Image,
	StyleSheet,
	View,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Events from '../../utils/events';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	cardContainer: {
		width: 120,
		height: 150,
		marginLeft: 10,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		borderBottomColor: 'rgba(0,0,0,0.2)',
		borderBottomWidth: 5,
	},
	cardTitle: {
		color: '#FFF',
		fontSize: 19,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 20,
	},
	rowContainer: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	rowDataContainer: {
		paddingLeft: 5,
	},
	rowImg: {
		width: 80,
		height: 80,
		borderRadius: 10,
	},
	rowTitle: {
		fontSize: 22,
		color: '#000',
	},
	rowDescription: {
		width: 214,
		fontSize: 12,
		color: '#5D5D5D',
	},
	rowPrice: {
		fontSize: 17,
		color: '#000',
		fontWeight: 'bold',
	},
	rowButtonContainer: {
		width: 56,
		height: 35,
		borderColor: '#F5A623',
		borderWidth: 2,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	rowButtonAddedContainer: {
		width: 56,
		height: 35,
		borderColor: '#F5A623',
		borderWidth: 2,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5A623',
	},
	rowIconButton: {
		paddingTop: 5,
	},
	rowTextButton: {
		color: '#F5A623',
		fontSize: 15,
	},
	notificationBar: {
		marginHorizontal: 20,
		padding: 15,
		backgroundColor: '#F5A623',
		borderRadius: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 15,
	},
	textNotification: {
		color: '#FFF',
		fontWeight: 'bold',
		fontSize: 16,
	}
});

class Menu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			products: [],
			store: {},
			user: {},
		};
		// this.loadCategories = this.loadCategories.bind(this)
		// this.loadProducts = this.loadProducts.bind(this)
		this.addProduct = this.addProduct.bind(this)
	}

	componentDidMount() {
		this.refreshEvent = Events.subscribe('RefreshList', () => this.loadProducts());
		// this.loadCategories();
		// this.loadProducts();
		this.getStore();
	}

	componentWillUnmount () {
		this.refreshEvent.remove();
	}

	modifyProduct(idProduct) {
		const { navigation } = this.props;
		navigation.navigate('ModifyProduct', { idProduct: idProduct })
	}

	getStore() {
		let store = {};
		AsyncStorage.getItem('user')
			.then((user) => {
				api.stores.getInfo(user)
					.then((storeRes) => {
						store = storeRes;
						return storeRes
					})
					.then((store) => {
						return api.products.getAll(store.idStore)
					})
					.then((products) => {
						this.setState({ store, products });
					})
					.catch(() => Alert.alert('Oops!', 'Ocurrio un error inesperado...'))
			})
			.catch(() => Alert.alert('Oops!', 'Ocurrio un error inesperado...'))
	}

	loadProducts() {
		const { store } = this.state;
		api.products.getAll(store.idStore)
			.then((data) => {
				this.setState({products: data});
			})
			.catch((err) => {
				Toast.show(err.message, Toast.LONG);
			});
	}

	addProduct() {
		const { navigation } = this.props;
		navigation.navigate('ModifyProduct')
	}

	_keyExtractor = (item, index) => item.name;

	// _renderCategory = ({item}) => (
	// 	<TouchableOpacity
	// 		style={styles.cardContainer}
	// 		onPress={() => this.loadProducts(item.name)}
	// 	>
	// 		<ImageBackground
	// 			source={{uri: `http://localhost:3000/${item.img}`}}
	// 			style={{ width: '100%', height: '100%' }}
	// 			imageStyle={{borderTopRightRadius: 10, borderTopLeftRadius: 10}}
	// 			>
	// 			<Text
	// 				style={styles.cardTitle}
	// 			>{item.name}</Text>
	// 		</ImageBackground>
	// 	</TouchableOpacity>
	// );

	_itemSeparator = () => (
		<View
			style={{
				paddingVertical: 1,
				marginHorizontal: 25,
				backgroundColor: '#C3C3C3',
			}}
		/>
	);

	_renderProduct = ({item}) => {
		return (
		<View
			style={styles.rowContainer}
		>
			{/* <Image
				source={{uri: `http://localhost:3000/${item.img}`}}
				style={styles.rowImg}
			/> */}
			<View
				style={styles.rowDataContainer}
			>
				<Text
					style={styles.rowTitle}
				>{item.name}</Text>
				<Text
					style={styles.rowDescription}
				>{item.description}</Text>
				<Text
					style={styles.rowPrice}
				>{`$${item.price}`}</Text>
				{ item.isRedeemable ?
				<Text
					style={[styles.rowPrice,{fontSize: 15}]}
				>{`${item.pricePoints} Puntos`}</Text>
				: null
				}
			</View>
			<TouchableOpacity
				style={styles.rowButtonAddedContainer}
				onPress={() => this.modifyProduct(item.idProduct)}
			>
				<Icon
					name="pencil"
					color="#FFF"
					size={24}
				/>
			</TouchableOpacity>
		</View>
	)};
	
	render() {
		const { products } = this.state;
		return (
			<SafeAreaView
				style={styles.container}
			>
				<Header
					title="Menu"
					btnName="ios-add"
					action={this.addProduct}
				/>
				{/* <View style={{marginTop: 2, flex: 1}}>
					<FlatList
						horizontal={true}
						data={categories}
						renderItem={this._renderCategory}
						keyExtractor={this._keyExtractor}
					/>
				</View> */}
				<View style={{flex: 3}}>
					<FlatList
						data={products}
						renderItem={this._renderProduct}
						ListFooterComponent={() => (
							<View
								style={{
								paddingVertical: 33,
								}}
							></View>
						)}
						keyExtractor={this._keyExtractor}
						ItemSeparatorComponent={this._itemSeparator}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

export default Menu;
