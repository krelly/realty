class ApartmentsPhotosController < ApplicationController
  def destroy
    # remove_image_at_index(params[:id].to_i)
    @apartment.apartment_photos.remove!(params[:id].to_i)
    flash[:error] = "Failed deleting image" unless @gallery.save
    redirect_to :back
  end
end
