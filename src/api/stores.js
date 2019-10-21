import request from '../utils/request';

function getInfo(idSeller) {
	return request({
		url: '/stores/one',
		params: { where: { idSeller } },
		method: 'GET',
	}).then((response) => {
		const { data, errmsg, errcode } = response.data;
		if (errmsg) throw Object({ message: errmsg, code: errcode });
		return data;
	});
}

export default {
	getInfo,
};
