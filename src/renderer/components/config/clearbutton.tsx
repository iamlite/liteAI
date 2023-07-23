import React from 'react';

class ClearButton extends React.Component {
	handleDeleteClick = () => {
		const keyToDelete = '';
		window.electron.ipcRenderer.store.delete(keyToDelete);
	};

	render() {
		return (
			<button
				type='button'
				className='btn btn-error btn-sm'
				onClick={this.handleDeleteClick}>
				Clear Store
			</button>
		);
	}
}

export default ClearButton;
