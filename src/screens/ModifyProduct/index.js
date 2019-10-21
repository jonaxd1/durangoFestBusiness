import React from 'react'
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Image,
	TouchableOpacity,
	Alert,
	Switch,
	ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import { Dropdown } from 'react-native-material-dropdown';
import Header from '../../components/Header';

import api from '../../api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Events from '../../utils/events'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	input: {
		paddingLeft: 10,
		marginHorizontal: 10,
		marginBottom: 20,
		fontSize: 18,
		color: '#000',
		borderBottomColor: '#c3c3c3',
		borderBottomWidth: 1,
	},
	label: {
		paddingLeft: 10,
		marginHorizontal: 10,
		fontSize: 15,
		color: '#c3c3c3',
	},
	button: {
		paddingVertical: 20,
		marginHorizontal: 30,
		backgroundColor: '#E5BE01',
		alignItems: 'center',
	}
});

class ModifyProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newProduct: false,
			loading: false,
		};
		this.getInfoProduct = this.getInfoProduct.bind(this);
		this.onClose = this.onClose.bind(this);
		this.update = this.update.bind(this);
		this.save = this.save.bind(this);
		this.validation = this.validation.bind(this);
	}

	componentDidMount() {
		const { navigation } = this.props;
		const idProduct = navigation.getParam('idProduct', null);
		if (idProduct) {
			this.getInfoProduct();
		} else {
			this.setState({ newProduct: true });
		}
	}

	getInfoProduct() {
		const { navigation } = this.props;
		const idProduct = navigation.getParam('idProduct', null);
		this.setState({loading: true},() => {
			api.products.getInfo(idProduct)
				.then((product) => {
					this.setState({ ...product, loading: false });
				})
				.catch((err) => {
					Toast.show(err, Toast.LONG);
				});
		})
	}

	changeInput = input => (value) => {
		this.setState({ [input]: value });
	};

	onClose() {
		const { navigation } = this.props;
		navigation.goBack();
	}

	update() {
		const {idProduct, name, description, price, isRedeemable, pricePoints} = this.state;
		api.products.update({idProduct, name, description, price, isRedeemable, pricePoints})
			.then(() => {
				const { navigation } = this.props
				Events.publish('RefreshList');
				Toast.show('Información guardada correctamente', Toast.LONG)
				navigation.goBack()
			})
			.catch((err) => {
				Toast.show(err, Toast.LONG);
			});
	}

	save() {
		const { name, description, price, isRedeemable, pricePoints } = this.state;
		api.products.create({name, description, price, isRedeemable, pricePoints})
			.then(() => {
				const { navigation } = this.props
				Events.publish('RefreshList');
				Toast.show('Información guardada correctamente', Toast.LONG)
				navigation.goBack()
			})
			.catch((err) => {
				Toast.show(err, Toast.LONG);
			});
	}

	validation() {
		const { name, description, price, isRedeemable, pricePoints, newProduct } = this.state;
		if (name && description && price) {
			if (isRedeemable && !pricePoints) {
				Alert.alert('Error', 'Debes rellenar todos los campos.');
			} else {
				this.setState({loading: true});
				if (newProduct) {
					setTimeout(() => {
						this.setState({ loading: false})
						this.save();
					}, 1500);
				} else {
					setTimeout(() => {
						this.setState({ loading: false})
						this.update();
					}, 1500);
				}
			}
		} else {
			Alert.alert('Error', 'Debes rellenar todos los campos.');
		}
	}

	render() {
		const { loading } = this.state;
		// let categories = [
		// 	{label: "Pizzas", value: "1"},
		// 	{label: "Postres", value: "2"},
		// 	{label: "Bebidas", value: "3"},
		// 	{label: "Ensaladas", value: "4"},
		// ]
		if(loading) {
			return (
				<View style={{
					flex: 1, flexDirection: "column",
					alignItems: "center",
					justifyContent: "center"
				}}>
					<ActivityIndicator size="large" />
				</View>
			)
		}
		return (
			<SafeAreaView
				style={styles.container}
			>
				<Header
					title="Editar Producto"
					btnName="ios-close"
					action={this.onClose}
				/>
				<View>
					{/* <Image
						source={{ uri: 'http://localhost:3000/' + this.state.img }}
						style={{ width: '100%', height: 100 }}
					/> */}
					<Text
						style={styles.label}
					>Nombre</Text>
					<TextInput
						style={styles.input}
						placeholder="Nombre"
						value={this.state.name}
						onChangeText={this.changeInput('name')}
					/>
					<Text
						style={styles.label}
					>Descripción</Text>
					<TextInput
						style={styles.input}
						placeholder="Descripción"
						multiline={true}
						value={this.state.description}
						onChangeText={this.changeInput('description')}
					/>
					<Text
						style={styles.label}
					>Precio</Text>
					<TextInput
						style={styles.input}
						placeholder="Precio"
						value={this.state.price ? String(this.state.price) : this.state.price}
						onChangeText={this.changeInput('price')}
						keyboardType="decimal-pad"
					/>
					{/* <Text
						style={styles.label}
					>Tiempo Estimado de Preparación</Text>
					<TextInput
						style={styles.input}
						placeholder="Tiempo Estimado de Preparación"
						value={this.state.estimatedTime ? String(this.state.estimatedTime) : this.state.estimatedTime}
						onChangeText={this.changeInput('estimatedTime')}
					/> */}
					{/* <Dropdown 
						containerStyle={{paddingLeft: 10, marginHorizontal: 10}}
						label="Categoria"
						data={categories}
						value={this.state.idCategory ? String(this.state.idCategory) : this.state.idCategory}
						onChangeText={this.changeInput('idCategory')}
					/> */}
					<View style={{ 
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginLeft: 10,
						marginRight: 30,
						marginBottom: 20,
					}}>
						<Text>Canjeable por puntos</Text>
						<Switch
							value={this.state.isRedeemable}
							onValueChange={this.changeInput('isRedeemable')}
						/>
					</View>
					{
						this.state.isRedeemable
						?
						<View>
							<Text
								style={styles.label}
							>Precio con Puntos</Text>
							<TextInput
								style={styles.input}
								placeholder="Precio con Puntos"
								value={this.state.pricePoints ? String(this.state.pricePoints) : this.state.pricePoints}
								onChangeText={this.changeInput('pricePoints')}
								keyboardType="decimal-pad"
							/>
						</View>
						: null
					}
					<TouchableOpacity
						style={styles.button}
						onPress={this.validation}
					>
						{ this.state.newProduct ?
							(<Text
								style={{color: '#FFF', fontWeight: 'bold'}}
							>Guardar</Text>
							)
							: (<Text
								style={{color: '#FFF', fontWeight: 'bold'}}
							>Actualizar</Text>)
						}
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}
}

export default ModifyProduct;