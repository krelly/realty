class ApartmentsController < ApplicationController
  before_action :set_apartment, only: [:show, :edit, :update, :destroy]
  skip_before_action :verify_authenticity_token, only:[:within_box]
  # GET /apartments
  # GET /apartments.json
  def index
    @apartments = Apartment.paginate(:page => params[:page]).includes(:apartment_photos)
  end

  def map
    @apartments = Apartment.all
  end

  def within_box
    sw_lat, sw_lon, ne_lat, ne_lon = params[:bounds].split(',')
    @sw = Geokit::LatLng.new(sw_lat,sw_lon)#55.59947660499516,36.92777694702146
    @ne = Geokit::LatLng.new(ne_lat,ne_lon)#55.832043988964585,38.22485031127929
    @apartments = Apartment.all
    points = Apartment.in_bounds([@sw, @ne], :origin => @somewhere).pluck(:id, :latitude, :longitude)

    markers = points.map do |point|
      {
        id: point[0],
        geometry: {type: "Point", coordinates: point[1,2]},
        properties: {"balloonContent": "Содержимое балуна"}
      }
    end
    respond_to do |format|
      format.json { render json: markers.as_json, :callback => params[:callback] }
    end
  end
  # GET /apartments/1
  # GET /apartments/1.json
  def show
    @apartment_photos = @apartment.apartment_photos
  end

  # GET /apartments/new
  def new
    @apartment = Apartment.new
    @apartment.apartment_photos.build
  end

  # GET /apartments/1/edit
  def edit
    @apartment.apartment_photos.build
  end

  # POST /apartments
  # POST /apartments.json
  def create
    @apartment = Apartment.new(apartment_params)

    respond_to do |format|
      if @apartment.save
        if params[:apartment_photos]
          params[:apartment_photos]['photo'].each do |a|
            @apartment_photos = @apartment.apartment_photos.create!(photo: a, apartment_id: @apartment.id)
          end
        end
        format.html { redirect_to @apartment, notice: 'Apartment was successfully created.' }
        format.json { render :show, status: :created, location: @apartment }
      else
        format.html { render :new }
        format.json { render json: @apartment.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /apartments/1
  # PATCH/PUT /apartments/1.json
  def update
    respond_to do |format|
      if @apartment.update(apartment_params)
        if params[:apartment_photos]
          params[:apartment_photos]['photo'].each do |a|
            @apartment_photos = @apartment.apartment_photos.create!(photo: a, apartment_id: @apartment.id)
          end
        end
        # if params[:apartment_photos]
        #   puts
        #   # @apartment.apartment_photos.update(apartment_photos_params)
        # end
        format.html { redirect_to @apartment, notice: 'Apartment was successfully updated.' }
        format.json { render :show, status: :ok, location: @apartment }
      else
        format.html { render :edit }
        format.json { render json: @apartment.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /apartments/1
  # DELETE /apartments/1.json
  def destroy
    @apartment.destroy
    respond_to do |format|
      format.html { redirect_to apartments_url, notice: 'Apartment was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_apartment
      @apartment = Apartment.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def apartment_params
      params.require(:apartment).permit(:description, :floor, :price, :rooms, :area, :address, :latitude, :longitude,
                                                                                    apartment_photos_attributes: [:id,:name, :_destroy, :photo], photos:[:id] )
    end
end
