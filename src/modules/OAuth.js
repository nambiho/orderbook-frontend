import api from 'utils/api';
import ServerConfig from 'ServerConfig';

/* Action Types */
/*
    1. 토큰을 생성해야 함

    2. 토큰을 확인해야 함

    3. 토큰을 리프레시해야 함
*/
export const OAUTH_REQUEST_UPDATE_TOKEN = 'OAUTH_REQUEST_UPDATE_TOKEN';

/* Utils For Action Creators */
// 토큰 발행, 리프레시 시 같이 사용되는 코드
// 서버 응답 동일
const prepareOAuth = () => {
    // AUTHRIZATION 헤더 변경
    api.setAccessToken(ServerConfig.TOKEN_AUTHORIZATION);

    // Content-Type 변경
    api.setContentType('application/x-www-form-urlencoded');
};

const cleanupOAuth = (accessToken) => {
    // api에 AUTHORIZATION 헤더를 accessToken으로 지정
    api.setAccessToken(`bearer ${accessToken}`);

    // api는 기본적으로 json 요청을 하므로 Content-Type 변경
    api.setContentType('application/json');
};

const dispatchToken = (dispatch, accessToken, refreshToken) => {
    // 받은 accessToken, refreshToken을 Reducer로 전달
    dispatch({
        type: OAUTH_REQUEST_UPDATE_TOKEN,
        payload: { accessToken, refreshToken },
    });
};

const commonRequestToken = getFormData => (dispatch, getState) => {
    prepareOAuth();

    api.post('/oauth/token', getFormData(getState))
        .then(({ data }) => {
            const { access_token: accessToken, refresh_token: refreshToken } = data;

            dispatchToken(dispatch, accessToken, refreshToken);

            cleanupOAuth(accessToken);
        });
};

/* Action Creators */
/* 토큰 발행 */
export const requestNewAccessToken = () => {
    // 1. formData 준비
    const getFormData = () => api.convertBodyAsFormUrlEncoded(ServerConfig.TOKEN_AUTH_FORM);

    // 2. 호출
    return commonRequestToken(getFormData);
};

/* 토큰 리프레시 */
export const requestTokenRefresh = () => {
    // 1. formData 준비
    const getFormData = getState => api.convertBodyAsFormUrlEncoded({
        refresh_token: getRefreshToken(getState()),
        grant_type: 'refresh_token',
    });

    // 2. 호출
    return commonRequestToken(getFormData);
};

/*
서버 응답 예시
    {
        "aud": [
            "orderbook-api"
        ],
        "active": true,
        "exp": 1545809333,
        "user_name": "test@email.com",
        "client_id": "orderbook",
        "scope": [
            "read",
            "write"
        ]
    }
*/
export const checkToken = () => {
    // 1. AUTHRIZATION 헤더 변경
    api.setAccessToken(ServerConfig.TOKEN_AUTHORIZATION);

    // 2. Content-Type 변경
    api.setContentType('application/x-www-form-urlencoded');

    const formData = api.convertBodyAsFormUrlEncoded(ServerConfig.TOKEN_AUTH_FORM);

    // 3. active를 받아서 반환
    return api.post('/oauth/check_token', formData);
};

/* Initial State */
const initialState = {
    accessToken: null,
    refreshToken: null,
};

/* Reducer */
export default function reducer(state = initialState, action) {
    switch (action.type) {
    case OAUTH_REQUEST_UPDATE_TOKEN:
        return {
            ...state,
            ...action.payload,
        };

    default:
        return state;
    }
}

/* Selectors */
export const getAccessToken = ({ OAuth }) => OAuth.accessToken;
export const getRefreshToken = ({ OAuth }) => OAuth.refreshToken;
