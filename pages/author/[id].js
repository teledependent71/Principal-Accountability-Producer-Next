import React from 'react'
import Head from 'next/head'

import { DataProvider, Repeater } from '@teleporthq/react-components'
import PropTypes from 'prop-types'
import {
  getEntities,
  getEntityByAttribute,
} from '@teleporthq/cms-mappers/caisy'

const Author = (props) => {
  return (
    <>
      <div className="author-container">
        <Head>
          <title>Author - Principal Accountability Producer</title>
          <meta
            property="og:title"
            content="Author - Principal Accountability Producer"
          />
        </Head>
        <DataProvider
          renderSuccess={(AuthorEntity) => (
            <>
              <div className="author-container1">
                <h1>{AuthorEntity?.name}</h1>
                <span>{AuthorEntity?.id}</span>
              </div>
            </>
          )}
          initialData={props.authorEntity}
          persistDataDuringLoading={true}
          key={props?.authorEntity?.id}
        />
      </div>
      <style jsx>
        {`
          .author-container {
            width: 100%;
            display: flex;
            overflow: auto;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .author-container1 {
            gap: 12px;
            width: 100%;
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
    </>
  )
}

Author.defaultProps = {
  authorEntity: [],
}

Author.propTypes = {
  authorEntity: PropTypes.array,
}

export default Author

export async function getStaticPaths() {
  try {
    const response = await getEntities({
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query: '{allAuthor{edges{node{id}}}}',
    })
    return {
      paths: (response?.data || []).map((item) => {
        return {
          params: {
            id: (item?.id).toString(),
          },
        }
      }),
      fallback: 'blocking',
    }
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps(context) {
  try {
    const response = await getEntityByAttribute({
      ...context?.params,
      projectId: '3bd8eb33-2aaa-4620-87bf-d7ccd04d0245',
      query:
        'query Author($value:ID!){Author(id:$value){_meta{createdAt updatedAt id}name image{__typename _meta{createdAt updatedAt id}description height id src title width}}}',
      attribute: 'id',
    })
    if (!response?.data?.[0]) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        authorEntity: response?.data?.[0],
        ...response?.meta,
      },
      revalidate: 60,
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
