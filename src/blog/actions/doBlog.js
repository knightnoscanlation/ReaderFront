import axios from 'axios';
import * as config from '../../config';
import params from '../../params.json';
import { queryBuilder } from '../../utils/helpers';

export function blogSelectPost(post) {
  return {
    type: 'BLOG_SELECT_POST',
    post: post
  };
}

export function blogPage(page) {
  return {
    type: 'BLOG_PAGE',
    page: page
  };
}

export function blogHasErrored(bool) {
  return {
    type: 'BLOG_HAS_ERRORED',
    hasErrored: bool
  };
}

export function blogIsLoading(bool) {
  return {
    type: 'BLOG_IS_LOADING',
    isLoading: bool
  };
}

export function blogFetchDataSuccess(posts, page) {
  return {
    type: 'BLOG_FETCH_DATA_SUCCESS',
    posts,
    page
  };
}

export function fetchPosts(lang, page, sort = 'ASC', perPage = 120) {
  return dispatch => {
    dispatch(blogIsLoading(true));

    if (lang === undefined || lang === null) {
      dispatch(blogHasErrored(true));
      throw Error('Lang is undefined');
    } else if (page === undefined || page === null) {
      dispatch(blogHasErrored(true));
      throw Error('Page is undefined');
    }

    axios
      .post(
        config.READER_PATH,
        queryBuilder({
          type: 'query',
          operation: 'posts',
          data: {
            language: params.global.languages[lang].id,
            orderBy: sort,
            first: perPage,
            offset: page
          },
          fields: [
            'id',
            'uniqid',
            'type',
            'title',
            'stub',
            'content',
            'user { id,name,role }',
            'category',
            'status',
            'sticky',
            'language',
            'thumbnail',
            'createdAt',
            'updatedAt'
          ]
        })
      )
      .then(response => {
        if (response.statusText !== 'OK') {
          throw Error(response.statusText);
        }

        return response.data.data.posts;
      })
      .then(posts =>
        posts.map(post => {
          const categoryLabel = Object.keys(params.blog.categories).find(
            st => params.blog.categories[st].id === post.category
          );
          return {
            ...post,
            categoryLabel
          };
        })
      )
      .then(posts => dispatch(blogFetchDataSuccess(posts, page)))
      .then(() => dispatch(blogIsLoading(false)))
      .catch(err => {
        console.error(err);
        dispatch(blogHasErrored(true));
      });
  };
}
