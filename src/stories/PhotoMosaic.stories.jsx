import React from 'react';
import PhotoMosaic from '../PhotoMosaic.js';

export default {
    title: '99-interactions/PhotoMosaic',
    component: PhotoMosaic,
};

const Template = (args) => <PhotoMosaic {...args} />;

export const Default = Template.bind({});
Default.args = {
    imageInfos: [{
        "webSearchUrl": "https://www.bing.com/images/search?view=detailv2&FORM=OIIRPO&q=Emperor+penguins&id=D756D702AD011A11F0D59C1A94DF8BFF08CA5C75&simid=608046513118471066",
        "name": "Archivo:Emperor Penguins (15885611526).jpg - Wikipedia, la enciclopedia libre",
        "thumbnailUrl": "https://tse3.mm.bing.net/th?id=OIP.uunOA3OY3gw6I8sDdlZ5qAHaJx&pid=Api",
        "datePublished": "2020-03-28T19:49:00.0000000Z",
        "isFamilyFriendly": true,
        "creativeCommons": "AttributionShareAlike",
        "contentUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Emperor_Penguins_(15885611526).jpg",
        "hostPageUrl": "https://es.wikipedia.org/wiki/Archivo:Emperor_Penguins_(15885611526).jpg",
        "contentSize": "8328129 B",
        "encodingFormat": "jpeg",
        "hostPageDisplayUrl": "https://es.wikipedia.org/wiki/Archivo:Emperor_Penguins...",
        "width": 3070,
        "height": 4052,
        "hostPageFavIconUrl": "https://www.bing.com/th?id=ODF.8fAdq30EV4Gt1O_Tgee0vA&pid=Api",
        "hostPageDiscoveredDate": "2020-03-28T19:49:00.0000000Z",
        "thumbnail": {
            "width": 474,
            "height": 625
        },
        "imageInsightsToken": "ccid_uunOA3OY*cp_5071BF528D2F3AA7B4F2F877680F4430*mid_D756D702AD011A11F0D59C1A94DF8BFF08CA5C75*simid_608046513118471066*thid_OIP.uunOA3OY3gw6I8sDdlZ5qAHaJx",
        "insightsMetadata": {
            "pagesIncludingCount": 38,
            "availableSizesCount": 28
        },
        "imageId": "D756D702AD011A11F0D59C1A94DF8BFF08CA5C75",
        "accentColor": "1C75AF"
    }],
    width: 400,
    height: 400
};
