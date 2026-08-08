import { mount } from 'ripple';
import { App } from './App.tsrx';

const root = document.getElementById('root');

if (root === null) {
	throw new Error('Không tìm thấy phần tử #root');
}

mount(App, {
	target: root,
});
