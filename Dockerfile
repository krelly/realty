FROM ruby:2.3.3

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
RUN mkdir /realty
WORKDIR /realty
COPY Gemfile /realty/Gemfile
COPY Gemfile.lock /realty/Gemfile.lock
RUN bundle install
COPY . /realty