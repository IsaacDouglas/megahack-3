# Use latest or what you need version of Swift docker container
FROM swift:latest

# Install packages needed by Perfect
RUN apt-get update && DEBIAN_FRONTEND=noninteractive 
RUN apt-get install -y --no-install-recommends apt-utils
RUN apt-get install -y openssl libssl-dev uuid-dev software-properties-common

# cURL usado na biblioteca PerfectCURL
RUN apt-get install -y libcurl4-openssl-dev

# conector do MySQL
RUN apt-get install -y libmysqlclient-dev

# conector do SQLite
# RUN apt-get install -y sqlite3
# RUN apt-get install -y libsqlite3-dev

# conector do PostgreSQL
# RUN apt-get install -y libpq-dev

# Make directory for building your project and copy project to container
RUN mkdir -p /usr/src/hackathon-megahack-3
COPY . /usr/src/hackathon-megahack-3

# Build binary file of your project and copy it to directory for binaries:
WORKDIR /usr/src/hackathon-megahack-3

# Make directory for save documents
RUN mkdir -p /root/Documents/db/database/
RUN touch /root/Documents/db/database/megahack3.db
RUN chmod 7777 /root/Documents/db/database/megahack3.db

RUN swift build
RUN cp /usr/src/hackathon-megahack-3/.build/debug/hackathon-megahack-3 /usr/local/bin/

# Remove source code
RUN rm -rf /usr/src/hackathon-megahack-3

# Bind container ports to the host
EXPOSE 8080

# Run binary file
RUN cd /usr/local/bin

CMD [ "hackathon-megahack-3" ]
