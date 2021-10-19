FROM node

RUN git clone https://github.com/jacobmischka/ics-merger.git
WORKDIR /ics-merger
RUN yarn install

COPY ./env.json /ics-merger/env.json
COPY ./run.sh /run.sh

RUN yarn build

EXPOSE 3000/tcp

ENTRYPOINT ["/run.sh"]
