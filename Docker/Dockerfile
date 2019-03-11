FROM node

RUN git clone https://github.com/jacobmischka/ics-merger.git
RUN cd /ics-merger && npm install && npm run-script build

COPY ./.env.json /ics-merger/.env.json
COPY ./run.sh /run.sh

EXPOSE 3000/tcp

ENTRYPOINT ["/run.sh"]
