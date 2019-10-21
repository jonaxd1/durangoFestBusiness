import AsyncStorage from '@react-native-community/async-storage';
import request from '../utils/request';

function signin(params) {
	debugger
	return request({
		url: '/signin/sellers',
		params,
		method: 'POST',
	}).then((response) => {
		const { data, user, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });

		const firstPair = ["TOKEN", data];
  		const secondPair = ["user", String(user.idSeller)];

		return new Promise((res, rej) => {
			AsyncStorage.multiSet([firstPair, secondPair], (err) => {
				if (err) return rej(err);
				return res(data);
			});
		});
	});
}

function signup(params) {
	return request({
		url: '/signup',
		params,
		method: 'POST',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });

		return new Promise((res, rej) => {
			AsyncStorage.setItem('TOKEN', data, (err) => {
				if (err) return rej(err);
				return res(data);
			});
		});
	});
}

function signout() {
	return new Promise((res, rej) => {
		AsyncStorage.removeItem('TOKEN', (err) => {
			if (err) return rej(err);
			return res();
		});
	});
}

export default {
	signin,
	signup,
	signout,
};
