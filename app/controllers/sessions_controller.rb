class SessionsController < ApplicationController

  def new
  end

  def create
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      # If the user exists AND the password entered is correct.
      session[:user_id] = user.id
      redirect_to root_url, notice: "Logged in"
    else
      flash.now[:error] = "Wrong email or password"
      render :new
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to apartments_url, notice: "Logged out"
  end

end
