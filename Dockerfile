FROM rinzeb/node-python-typescript-git

# Create app directory
RUN mkdir -p /src
WORKDIR /src

# Install app dependencies
COPY package.json /src/
COPY yarn.lock /src/
RUN yarn

# Bundle app source
COPY . /src/
RUN mkdir -p /root/mbtiles-server

# Enables customized options using environment variables
ENV MBTILES_PORT='3344'

# Run App
EXPOSE 3344

RUN yarn install --production
WORKDIR /src
RUN tsc

CMD ["yarn", "start"]
