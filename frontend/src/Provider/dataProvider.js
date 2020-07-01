import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';
import decodeJwt from 'jwt-decode';

const apiUrl = 'http://localhost:8181';

const httpClient = (url, options = {}) => {
    options.user = {
        authenticated: true,
        token: `Bearer ${localStorage.getItem('token')}`
    };
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    let date = new Date();
    let timezoneOffset = date.getTimezoneOffset() * 60;
    options.headers.set('Timezone-Offset-Header', timezoneOffset);
    return fetchUtils.fetchJson(url, options);
}

function getTokenFromBody(json) {
    let token = json.token
    if (token) {
        const decodedToken = decodeJwt(token);
        localStorage.setItem('token', token);
        localStorage.setItem('permissions', decodedToken.permissions);
    }
    return json
}

export default {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const query = {
            sort: JSON.stringify(params.sort),
            range: JSON.stringify({start: ((page - 1) * perPage), end: (page * perPage - 1)}),
            filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            getTokenFromBody(json)
            return {
                data: json.object,
                total: parseInt(headers.get('content-range').split('/').pop(), 10)
            }
        });
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => {
            getTokenFromBody(json)
            return { data: json.object }
        }),

    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => {
            getTokenFromBody(json)
            return { data: json.object }
        });
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const query = {
            sort: JSON.stringify(params.sort),
            range: JSON.stringify({start: ((page - 1) * perPage), end: (page * perPage - 1)}),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => {
            getTokenFromBody(json)
            return {
                data: json.object,
                total: parseInt(headers.get('content-range').split('/').pop(), 10),
            }
        });
    },

    update: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => {
            getTokenFromBody(json)
            return { data: json.object }
        }),

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => {
            getTokenFromBody(json)
            return { data: json.object }
        });
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => {
            getTokenFromBody(json)
            return { data: { ...params.data, id: json.object.id } }
        }),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => {
            getTokenFromBody(json)
            return { data: json.object }
        }),

    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => {
            getTokenFromBody(json)
            return { data: json }
        });
    }
};