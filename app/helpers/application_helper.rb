module ApplicationHelper
  def nav_link(link_text, link_path, options = nil)
    link_hash = Rails.application.routes.recognize_path link_path
    options[:class] << ' active' if current_page_and_action(link_hash)
    link_to link_text, link_path, options
  end

  def current_page_and_action(controller:, action:)
    if controller?(controller) && action?(action)
      true
    else
      false
    end
  end

  def controller?(*controller)
    controller.include?(controller_name)
  end

  def action?(*action)
   action.include?(action_name)
  end
end
