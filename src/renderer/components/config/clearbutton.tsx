import React from 'react';

class ClearButton extends React.Component {
	handleDeleteClick = () => {
		window.electron.ipcRenderer.store.clear();
	};

	render() {
		return (
			<button
				type='button'
				className='btn btn-error btn-sm'
				onClick={this.handleDeleteClick}
			>
				Clear Store
			</button>
		);
	}
}

export default ClearButton;
