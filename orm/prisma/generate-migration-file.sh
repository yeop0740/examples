#!/bin/bash
SRC_DIR_NAME='prisma'
DST_DIR_NAME='data'

mkdir -p ${DST_DIR_NAME}
cat ${SRC_DIR_NAME}/migrations/*/*.sql > ${DST_DIR_NAME}/init.sql
