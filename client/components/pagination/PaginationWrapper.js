import React from 'react'
import styles from './pagination-wrapper.module.css'
import { isEmpty } from "../../util/helpers"
import Router from "next/router";
const PaginationWrapper = ({ pagination }) => {
    const { currentIndex, pages, limit, prev, next } = pagination
    let arr = Array.apply(null, Array(pages));
    let items = arr.map(function (x, i) {
        return i;
    });


    return (

        <React.Fragment>
            {!isEmpty(pagination) && pagination.pages > 1 ? (



                <div className={styles.pagination}>

                    {!isEmpty(prev) ? (
                        <a

                            onClick={() => {
                                Router.push({
                                    pathname: "/",
                                    query: {
                                        page: `${parseInt(currentIndex, 10) - 1}`,
                                        limit: limit,
                                    },
                                });
                            }}
                        >
                            &laquo;
                        </a>
                    ) : null}


                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            {(() => {
                                if (parseInt(currentIndex, 10) === item + 1) {
                                    return (
                                        <a href="#" className={styles.active}>{item + 1}</a>

                                    );
                                } else {
                                    return (
                                        <a onClick={() => {
                                            Router.push({
                                                pathname: "/",
                                                query: { page: `${item + 1}`, limit: limit },
                                            });
                                        }}>{item + 1}</a>

                                    );
                                }

                            })()}
                        </React.Fragment>

                    ))}

                    {!isEmpty(next) ? (
                        <a
                            className="next page-numbers anchor-tag-decor"
                            onClick={() => {
                                Router.push({
                                    pathname: "/",
                                    query: {
                                        page: `${parseInt(currentIndex, 10) + 1}`,
                                        limit: limit,
                                    },
                                });
                            }}
                        >
                            &raquo;
                        </a>
                    ) : null}
                </div>

            ) : null}
        </React.Fragment>





    )
}

export default PaginationWrapper
