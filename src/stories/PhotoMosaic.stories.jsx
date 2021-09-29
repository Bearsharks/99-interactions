import React from 'react';
import PhotoMosaic from '../Mosaic.js';

export default {
    title: '99-interactions/PhotoMosaic',
    component: PhotoMosaic,
};

const Template = (args) => <PhotoMosaic {...args} />;

export const Default = Template.bind({});
Default.args = {
};
