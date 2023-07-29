import React from 'react';

interface LoadingProps {
    loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading }) => {
    if (!loading) {
        return null;
    }

    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center rounded-3xl justify-center bg-black/80 text-white z-50'>
            <div className='flex flex-col justify-center items-center space-x-1 text-sm'>
                <span className='loading loading-ring loading-lg' />
                <h1 className='text-3xl font-md'>Loading</h1>
            </div>
        </div>
    );
};


export default Loading;
